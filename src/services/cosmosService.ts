import { CosmosClient, Database, Container } from '@azure/cosmos';
import { CPIFDocument } from '../types/cpif';

export class CosmosService {
  private cosmosClient: CosmosClient;
  private database: Database;
  private container: Container;

  constructor() {
    const endpoint = process.env.REACT_APP_COSMOS_ENDPOINT;
    const key = process.env.REACT_APP_COSMOS_KEY;
    
    console.log('Cosmos DB Environment Variables:', {
      endpoint: endpoint ? 'Set' : 'Not set',
      key: key ? 'Set' : 'Not set'
    });
    
    // For now, let's use mock data if environment variables aren't set
    if (!endpoint || !key) {
      console.warn('Cosmos DB environment variables not set - using mock mode');
      this.cosmosClient = null as any;
      this.database = null as any;
      this.container = null as any;
      return;
    }
    
    this.cosmosClient = new CosmosClient({
      endpoint: endpoint,
      key: key
    });
    
    this.database = this.cosmosClient.database('cpif-database');
    this.container = this.database.container('cpif-forms');
  }

  // Save CPIF document
  async saveCPIF(cpifData: CPIFDocument): Promise<CPIFDocument> {
    if (!this.container) {
      console.warn('Cosmos DB not initialized - saving to localStorage instead');
      const savedData = { ...cpifData, id: Date.now().toString() };
      localStorage.setItem('cpif-draft', JSON.stringify(savedData));
      return savedData;
    }
    
    try {
      const { resource } = await this.container.items.create(cpifData);
      return resource;
    } catch (error) {
      console.error('Failed to save CPIF:', error);
      throw error;
    }
  }

  // Get CPIF by ID
  async getCPIFById(id: string): Promise<CPIFDocument | null> {
    try {
      const { resource } = await this.container.item(id).read();
      return resource;
    } catch (error: any) {
      if (error.code === 404) {
        return null;
      }
      throw error;
    }
  }

  // Get all CPIFs for a user
  async getCPIFsByUser(userId: string): Promise<CPIFDocument[]> {
    const query = {
      query: "SELECT * FROM c WHERE c.createdBy = @userId ORDER BY c.timestamp DESC",
      parameters: [{ name: "@userId", value: userId }]
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    return resources;
  }

  // Search CPIFs
  async searchCPIFs(searchTerm: string, userId: string): Promise<CPIFDocument[]> {
    const query = {
      query: `
        SELECT * FROM c 
        WHERE c.createdBy = @userId 
        AND (CONTAINS(c.accountInfo.legalName, @searchTerm, true) 
        OR CONTAINS(c.accountInfo.primaryContact, @searchTerm, true))
        ORDER BY c.timestamp DESC
      `,
      parameters: [
        { name: "@userId", value: userId },
        { name: "@searchTerm", value: searchTerm }
      ]
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    return resources;
  }

  // Update CPIF
  async updateCPIF(id: string, cpifData: Partial<CPIFDocument>): Promise<CPIFDocument> {
    try {
      const { resource } = await this.container.item(id).replace({
        ...cpifData,
        lastModified: new Date(),
        version: (cpifData.version || 0) + 1
      });
      return resource;
    } catch (error) {
      console.error('Failed to update CPIF:', error);
      throw error;
    }
  }

  // Delete CPIF
  async deleteCPIF(id: string): Promise<void> {
    try {
      await this.container.item(id).delete();
    } catch (error) {
      console.error('Failed to delete CPIF:', error);
      throw error;
    }
  }

  // Get CPIFs by status
  async getCPIFsByStatus(status: string, userId: string): Promise<CPIFDocument[]> {
    const query = {
      query: "SELECT * FROM c WHERE c.createdBy = @userId AND c.status = @status ORDER BY c.timestamp DESC",
      parameters: [
        { name: "@userId", value: userId },
        { name: "@status", value: status }
      ]
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    return resources;
  }

  // Get CPIFs by date range
  async getCPIFsByDateRange(startDate: Date, endDate: Date, userId: string): Promise<CPIFDocument[]> {
    const query = {
      query: "SELECT * FROM c WHERE c.createdBy = @userId AND c.timestamp >= @startDate AND c.timestamp <= @endDate ORDER BY c.timestamp DESC",
      parameters: [
        { name: "@userId", value: userId },
        { name: "@startDate", value: startDate.toISOString() },
        { name: "@endDate", value: endDate.toISOString() }
      ]
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    return resources;
  }
}

