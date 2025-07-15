export const getAllInvoices = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "payment_date" } },
        { field: { Name: "client_id" } },
        { field: { Name: "project_id" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("app_invoice", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Transform database response to match UI expectations
    return response.data.map(invoice => ({
      ...invoice,
      clientId: invoice.client_id,
      projectId: invoice.project_id,
      dueDate: invoice.due_date,
      paymentDate: invoice.payment_date
    }));
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "payment_date" } },
        { field: { Name: "client_id" } },
        { field: { Name: "project_id" } }
      ]
    };
    
    const response = await apperClient.getRecordById("app_invoice", parseInt(id), params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Transform database response to match UI expectations
    return {
      ...response.data,
      clientId: response.data.client_id,
      projectId: response.data.project_id,
      dueDate: response.data.due_date,
      paymentDate: response.data.payment_date
    };
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    // Validate required fields
    if (!invoiceData.projectId) {
      throw new Error("Project ID is required");
    }
    if (!invoiceData.amount || invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (!invoiceData.dueDate) {
      throw new Error("Due date is required");
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Name: `Invoice ${Date.now()}`,
        amount: parseFloat(invoiceData.amount),
        status: invoiceData.status || 'draft',
        due_date: invoiceData.dueDate,
        client_id: invoiceData.clientId ? parseInt(invoiceData.clientId) : null,
        project_id: parseInt(invoiceData.projectId)
      }]
    };
    
    const response = await apperClient.createRecord("app_invoice", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create invoice');
      }
      
      const successfulRecord = response.results[0];
      return {
        ...successfulRecord.data,
        clientId: successfulRecord.data.client_id,
        projectId: successfulRecord.data.project_id,
        dueDate: successfulRecord.data.due_date,
        paymentDate: successfulRecord.data.payment_date
      };
    }
    
    throw new Error('No results returned from server');
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid invoice ID");
    }
    
    // Validate data if provided
    if (invoiceData.amount !== undefined && invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const updateData = {
      Id: parsedId
    };
    
    if (invoiceData.amount !== undefined) updateData.amount = parseFloat(invoiceData.amount);
    if (invoiceData.status !== undefined) updateData.status = invoiceData.status;
    if (invoiceData.dueDate !== undefined) updateData.due_date = invoiceData.dueDate;
    if (invoiceData.paymentDate !== undefined) updateData.payment_date = invoiceData.paymentDate;
    if (invoiceData.clientId !== undefined) updateData.client_id = invoiceData.clientId ? parseInt(invoiceData.clientId) : null;
    if (invoiceData.projectId !== undefined) updateData.project_id = parseInt(invoiceData.projectId);
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord("app_invoice", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update invoice');
      }
      
      const successfulRecord = response.results[0];
      return {
        ...successfulRecord.data,
        clientId: successfulRecord.data.client_id,
        projectId: successfulRecord.data.project_id,
        dueDate: successfulRecord.data.due_date,
        paymentDate: successfulRecord.data.payment_date
      };
    }
    
    throw new Error('No results returned from server');
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const markInvoiceAsSent = async (id) => {
  try {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid invoice ID");
    }
    
    // Get current invoice to check status
    const currentInvoice = await getInvoiceById(id);
    
    if (currentInvoice.status !== "draft") {
      throw new Error("Only draft invoices can be marked as sent");
    }
    
    return await updateInvoice(id, { status: "sent" });
  } catch (error) {
    console.error("Error marking invoice as sent:", error);
    throw error;
  }
};

export const markInvoiceAsPaid = async (id, paymentDate) => {
  try {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid invoice ID");
    }
    
    if (!paymentDate) {
      throw new Error("Payment date is required");
    }
    
    // Get current invoice to check status
    const currentInvoice = await getInvoiceById(id);
    
    if (currentInvoice.status === "paid") {
      throw new Error("Invoice is already marked as paid");
    }
    
    return await updateInvoice(id, { 
      status: "paid", 
      paymentDate: new Date(paymentDate).toISOString() 
    });
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid invoice ID");
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parsedId]
    };
    
    const response = await apperClient.deleteRecord("app_invoice", params);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete invoice');
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};