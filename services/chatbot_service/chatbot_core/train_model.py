import json
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import os
from tqdm import tqdm
import logging
from sklearn.preprocessing import MultiLabelBinarizer
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DiseaseDataset(Dataset):
    def __init__(self, kb_path):
        with open(kb_path, 'r', encoding='utf-8') as f:
            self.diseases = json.load(f)
        
        # Convert diseases to list of (name, symptoms) pairs
        self.data = []
        self.mlb = MultiLabelBinarizer()
        
        # Prepare data
        for disease_id, info in self.diseases.items():
            self.data.append({
                'id': disease_id,
                'name': info['name'],
                'symptoms': info['symptoms']
            })
        
        # Fit MultiLabelBinarizer on all symptoms
        all_symptoms = [item['symptoms'] for item in self.data]
        self.mlb.fit(all_symptoms)
        
        # Transform symptoms to binary vectors
        for item in self.data:
            item['symptoms_binary'] = self.mlb.transform([item['symptoms']])[0]
        
        self.num_classes = len(self.mlb.classes_)
        
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        item = self.data[idx]
        # Return symptoms binary vector as both input and target
        return torch.FloatTensor(item['symptoms_binary']), torch.FloatTensor(item['symptoms_binary'])

class TrainNN(nn.Module):
    def __init__(self, input_size):
        super(TrainNN, self).__init__()
        self.network = nn.Sequential(
            # Input layer
            nn.Linear(input_size, 128),
            nn.ReLU(),
            nn.BatchNorm1d(128),
            nn.Dropout(0.3),
            
            # Hidden layer 1
            nn.Linear(128, 256),
            nn.ReLU(),
            nn.BatchNorm1d(256),
            nn.Dropout(0.3),
            
            # Hidden layer 2
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.BatchNorm1d(128),
            nn.Dropout(0.3),
            
            # Hidden layer 3
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.BatchNorm1d(64),
            nn.Dropout(0.3),
            
            # Output layer
            nn.Linear(64, input_size),
            nn.Sigmoid()
        )
        
    def forward(self, x):
        return self.network(x)

def train_model():
    # Setup paths
    kb_path = os.path.join(os.path.dirname(__file__), '..', 'kb', 'diseases.json')
    
    # Create dataset
    logger.info("Loading disease dataset...")
    dataset = DiseaseDataset(kb_path)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    
    # Initialize model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = TrainNN(dataset.num_classes).to(device)
    criterion = nn.BCELoss()
    optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=2, factor=0.5)
    
    # Training loop
    logger.info("Starting model training...")
    num_epochs = 100
    best_loss = float('inf')
    
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        
        for i, (inputs, targets) in enumerate(tqdm(dataloader)):
            inputs, targets = inputs.to(device), targets.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            
            # Gradient clipping
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            
            optimizer.step()
            
            running_loss += loss.item()
            
            if i % 10 == 0:
                logger.info(f'Epoch [{epoch+1}/{num_epochs}], Step [{i+1}/{len(dataloader)}], '
                          f'Loss: {loss.item():.4f}')
        
        epoch_loss = running_loss / len(dataloader)
        
        # Learning rate scheduling
        scheduler.step(epoch_loss)
        
        logger.info(f'Epoch [{epoch+1}/{num_epochs}], Loss: {epoch_loss:.4f}, '
                   f'LR: {optimizer.param_groups[0]["lr"]:.6f}')
        
        # Save best model
        if epoch_loss < best_loss:
            best_loss = epoch_loss
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'loss': best_loss,
                'mlb_classes': dataset.mlb.classes_,
            }, 'best_model.pth')
            logger.info("Saved best model checkpoint!")
    
    logger.info("Training completed!")
    return model

if __name__ == "__main__":
    train_model() 