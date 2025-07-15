export const getAllClients = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "created_at" } },
        { field: { Name: "notes" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("client", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Transform database response to match UI expectations
    return response.data.map(client => ({
      ...client,
      name: client.Name,
      createdAt: client.created_at
    }));
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "created_at" } },
        { field: { Name: "notes" } }
      ]
    };
    
    const response = await apperClient.getRecordById("client", parseInt(id), params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Transform database response to match UI expectations
    return {
      ...response.data,
      name: response.data.Name,
      createdAt: response.data.created_at
    };
  } catch (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Name: clientData.name,
        email: clientData.email,
        company: clientData.company,
        status: clientData.status || 'active',
        created_at: new Date().toISOString(),
        notes: clientData.notes || ''
      }]
    };
    
    const response = await apperClient.createRecord("client", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create client');
      }
      
      const successfulRecord = response.results[0];
      return {
        ...successfulRecord.data,
        name: successfulRecord.data.Name,
        createdAt: successfulRecord.data.created_at
      };
    }
    
    throw new Error('No results returned from server');
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Id: parseInt(id),
        Name: clientData.name,
        email: clientData.email,
        company: clientData.company,
        status: clientData.status,
        notes: clientData.notes || ''
      }]
    };
    
    const response = await apperClient.updateRecord("client", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update client');
      }
      
      const successfulRecord = response.results[0];
      return {
        ...successfulRecord.data,
        name: successfulRecord.data.Name,
        createdAt: successfulRecord.data.created_at
      };
    }
    
    throw new Error('No results returned from server');
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("client", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete client');
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};