import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Issue {
  id: string;
  userId: string;
  assignedTo?: string;
  type: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "escalated" | "resolved" | "closed";
  files: Array<{ url: string; type: string }>;
  metadata: {
    comments?: Array<{
      id: string;
      userId: string;
      comment: string;
      createdAt: string;
    }>;
    escalationReason?: string;
    escalatedBy?: string;
    escalatedAt?: string;
    resolution?: string;
    resolvedAt?: string;
  };
  reporter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface IssuePagination {
  total: number;
  page: number;
  totalPages: number;
}

// ==================== User Routes ====================

/**
 * Create a new issue.
 * @param {FormData} formData - The form data containing issue details and files.
 * @returns {Promise<Issue>} - The created issue.
 */
export async function createIssue(formData: FormData): Promise<Issue> {
  try {
    const response = await axios.post(`${API_URL}/issues`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
}

/**
 * Fetch issues reported by the current user.
 * @param {string} status - Optional filter by status.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{ issues: Issue[]; pagination: IssuePagination }>} - List of issues and pagination details.
 */
export async function getMyIssues(
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ issues: Issue[]; pagination: IssuePagination }> {
  try {
    const response = await axios.get(`${API_URL}/issues/my-issues`, {
      params: { status, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching my issues:", error);
    return { issues: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  }
}

/**
 * Fetch an issue by its ID.
 * @param {string} issueId - The ID of the issue.
 * @returns {Promise<Issue>} - The issue details.
 */
export async function getIssueById(issueId: string): Promise<Issue> {
  try {
    const response = await axios.get(`${API_URL}/issues/${issueId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching issue by ID:", error);
    throw error;
  }
}

/**
 * Add a comment to an issue.
 * @param {string} issueId - The ID of the issue.
 * @param {string} comment - The comment to add.
 * @returns {Promise<{ comment: { id: string; userId: string; comment: string; createdAt: string } }>} - The added comment.
 */
export async function addComment(
  issueId: string,
  comment: string
): Promise<{
  comment: { id: string; userId: string; comment: string; createdAt: string };
}> {
  try {
    const response = await axios.put(`${API_URL}/issues/${issueId}/comment`, {
      comment,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// ==================== Admin Routes ====================

/**
 * Fetch all issues (admin only).
 * @param {string} status - Optional filter by status.
 * @param {string} priority - Optional filter by priority.
 * @param {string} type - Optional filter by type.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{ issues: Issue[]; pagination: IssuePagination }>} - List of issues and pagination details.
 */
export async function getAllIssues(
  status?: string,
  priority?: string,
  type?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ issues: Issue[]; pagination: IssuePagination }> {
  try {
    const response = await axios.get(`${API_URL}/issues`, {
      params: { status, priority, type, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all issues:", error);
    return { issues: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  }
}

/**
 * Assign an issue to a user (admin only).
 * @param {string} issueId - The ID of the issue.
 * @param {string} assigneeId - The ID of the user to assign the issue to.
 * @returns {Promise<Issue>} - The updated issue.
 */
export async function assignIssue(
  issueId: string,
  assigneeId: string
): Promise<Issue> {
  try {
    const response = await axios.put(`${API_URL}/issues/${issueId}/assign`, {
      assigneeId,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error assigning issue:", error);
    throw error;
  }
}

/**
 * Escalate an issue (admin only).
 * @param {string} issueId - The ID of the issue.
 * @param {string} reason - The reason for escalation.
 * @returns {Promise<Issue>} - The updated issue.
 */
export async function escalateIssue(
  issueId: string,
  reason: string
): Promise<Issue> {
  try {
    const response = await axios.put(`${API_URL}/issues/${issueId}/escalate`, {
      reason,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error escalating issue:", error);
    throw error;
  }
}

/**
 * Resolve an issue (admin only).
 * @param {string} issueId - The ID of the issue.
 * @param {string} resolution - The resolution details.
 * @returns {Promise<Issue>} - The updated issue.
 */
export async function resolveIssue(
  issueId: string,
  resolution: string
): Promise<Issue> {
  try {
    const response = await axios.put(`${API_URL}/issues/${issueId}/resolve`, {
      resolution,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error resolving issue:", error);
    throw error;
  }
}

/**
 * Close an issue (admin only).
 * @param {string} issueId - The ID of the issue.
 * @returns {Promise<Issue>} - The updated issue.
 */
export async function closeIssue(issueId: string): Promise<Issue> {
  try {
    const response = await axios.put(`${API_URL}/issues/${issueId}/close`);
    return response.data.data;
  } catch (error) {
    console.error("Error closing issue:", error);
    throw error;
  }
}
