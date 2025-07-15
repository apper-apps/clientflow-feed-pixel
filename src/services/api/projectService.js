export const getAllProjects = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "status" } },
        { field: { Name: "budget" } },
        { field: { Name: "start_date" } },
        { field: { Name: "end_date" } },
        { 
          field: { Name: "client_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("project", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Transform database response to match UI expectations
    return response.data.map(project => ({
      ...project,
      name: project.Name,
      clientId: project.client_id?.Id || project.client_id,
      startDate: project.start_date,
      endDate: project.end_date
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "status" } },
        { field: { Name: "budget" } },
        { field: { Name: "start_date" } },
        { field: { Name: "end_date" } },
        { 
          field: { Name: "client_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ]
    };
    
    const response = await apperClient.getRecordById("project", parseInt(id), params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Transform database response to match UI expectations
    return {
      ...response.data,
      name: response.data.Name,
      clientId: response.data.client_id?.Id || response.data.client_id,
      startDate: response.data.start_date,
      endDate: response.data.end_date
    };
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Name: projectData.name,
        status: projectData.status || 'planning',
        budget: parseFloat(projectData.budget),
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        client_id: parseInt(projectData.clientId)
      }]
    };
    
    const response = await apperClient.createRecord("project", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create project');
      }
      
      const successfulRecord = response.results[0];
      return {
        ...successfulRecord.data,
        name: successfulRecord.data.Name,
        clientId: successfulRecord.data.client_id,
        startDate: successfulRecord.data.start_date,
        endDate: successfulRecord.data.end_date
      };
    }
    
    throw new Error('No results returned from server');
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Id: parseInt(id),
        Name: projectData.name,
        status: projectData.status,
        budget: parseFloat(projectData.budget),
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        client_id: parseInt(projectData.clientId)
      }]
    };
    
    const response = await apperClient.updateRecord("project", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update project');
      }
      
      const successfulRecord = response.results[0];
      return {
        ...successfulRecord.data,
        name: successfulRecord.data.Name,
        clientId: successfulRecord.data.client_id,
        startDate: successfulRecord.data.start_date,
        endDate: successfulRecord.data.end_date
      };
    }
    
    throw new Error('No results returned from server');
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("project", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete project');
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};