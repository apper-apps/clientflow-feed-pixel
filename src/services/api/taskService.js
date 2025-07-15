export const getAllTasks = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "time_tracking" } },
        { field: { Name: "project_id" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("task", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Transform database response to match UI expectations
    return response.data.map(task => ({
      ...task,
      title: task.title || task.Name,
      dueDate: task.due_date,
      projectId: task.project_id,
      timeTracking: task.time_tracking ? (typeof task.time_tracking === 'string' ? JSON.parse(task.time_tracking) : task.time_tracking) : {
        totalTime: 0,
        activeTimer: null,
        timeLogs: []
      }
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "time_tracking" } },
        { field: { Name: "project_id" } }
      ]
    };
    
    const response = await apperClient.getRecordById("task", parseInt(id), params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Transform database response to match UI expectations
    return {
      ...response.data,
      title: response.data.title || response.data.Name,
      dueDate: response.data.due_date,
      projectId: response.data.project_id,
      timeTracking: response.data.time_tracking ? (typeof response.data.time_tracking === 'string' ? JSON.parse(response.data.time_tracking) : response.data.time_tracking) : {
        totalTime: 0,
        activeTimer: null,
        timeLogs: []
      }
    };
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Name: taskData.title,
        title: taskData.title,
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        due_date: taskData.dueDate,
        time_tracking: JSON.stringify({
          totalTime: 0,
          activeTimer: null,
          timeLogs: []
        }),
        project_id: parseInt(taskData.projectId)
      }]
    };
    
    const response = await apperClient.createRecord("task", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create task');
      }
      
      const successfulRecord = response.results[0];
      return {
        ...successfulRecord.data,
        title: successfulRecord.data.title,
        dueDate: successfulRecord.data.due_date,
        projectId: successfulRecord.data.project_id,
        timeTracking: JSON.parse(successfulRecord.data.time_tracking)
      };
    }
    
    throw new Error('No results returned from server');
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const updateData = {
      Id: parseInt(id)
    };
    
    if (taskData.title !== undefined) {
      updateData.title = taskData.title;
      updateData.Name = taskData.title;
    }
    if (taskData.priority !== undefined) updateData.priority = taskData.priority;
    if (taskData.status !== undefined) updateData.status = taskData.status;
    if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate;
    if (taskData.timeTracking !== undefined) updateData.time_tracking = JSON.stringify(taskData.timeTracking);
    if (taskData.projectId !== undefined) updateData.project_id = parseInt(taskData.projectId);
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord("task", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update task');
      }
      
      const successfulRecord = response.results[0];
      return {
        ...successfulRecord.data,
        title: successfulRecord.data.title,
        dueDate: successfulRecord.data.due_date,
        projectId: successfulRecord.data.project_id,
        timeTracking: typeof successfulRecord.data.time_tracking === 'string' ? JSON.parse(successfulRecord.data.time_tracking) : successfulRecord.data.time_tracking
      };
    }
    
    throw new Error('No results returned from server');
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  return await updateTask(id, { status });
};

export const deleteTask = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("task", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete task');
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const startTaskTimer = async (id) => {
  try {
    const task = await getTaskById(id);
    
    if (task.timeTracking?.activeTimer) {
      throw new Error("Timer already running for this task");
    }
    
    const now = new Date().toISOString();
    const activeTimer = {
      Id: task.Id,
      startTime: now
    };
    
    const updatedTimeTracking = {
      ...task.timeTracking,
      activeTimer
    };
    
    await updateTask(id, { timeTracking: updatedTimeTracking });
    return activeTimer;
  } catch (error) {
    console.error("Error starting task timer:", error);
    throw error;
  }
};

export const stopTaskTimer = async (id) => {
  try {
    const task = await getTaskById(id);
    
    if (!task.timeTracking?.activeTimer) {
      throw new Error("No active timer for this task");
    }
    
    const now = new Date().toISOString();
    const startTime = new Date(task.timeTracking.activeTimer.startTime);
    const endTime = new Date(now);
    const duration = endTime.getTime() - startTime.getTime();
    
    const timeLog = {
      Id: Date.now(),
      startTime: task.timeTracking.activeTimer.startTime,
      endTime: now,
      duration: duration,
      date: startTime.toISOString().split('T')[0]
    };
    
    const updatedTimeTracking = {
      ...task.timeTracking,
      totalTime: (task.timeTracking.totalTime || 0) + duration,
      activeTimer: null,
      timeLogs: [...(task.timeTracking.timeLogs || []), timeLog]
    };
    
    await updateTask(id, { timeTracking: updatedTimeTracking });
    return timeLog;
  } catch (error) {
    console.error("Error stopping task timer:", error);
    throw error;
  }
};

export const getTaskTimeLogs = async (id) => {
  try {
    const task = await getTaskById(id);
    return task.timeTracking?.timeLogs || [];
  } catch (error) {
    console.error("Error getting task time logs:", error);
    throw error;
  }
};