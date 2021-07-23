async function getAllTasks() {
  try {
    const response = await fetch("/api/tasks");
    try {
      const tasksJson = await response.json();
      if (response.ok) {
        return tasksJson;
      } else {
        throw tasksJson;
      }
    } catch {
      throw { error: "Cannot parse server response." };
    }
  } catch {
    throw { error: "Cannot communicate with the server." };
  }
}

async function getFilteredTask(filter) {
  try {
    const response = await fetch("/api/tasks?filter=" + filter);

    try {
      const tasksJson = await response.json();
      if (response.ok) {
        return tasksJson;
      } else {
        throw tasksJson;
      }
    } catch {
      throw { error: "Cannot parse server response." };
    }
  } catch {
    throw { error: "Cannot communicate with the server." };
  }
}

async function getFilteredDeadlineTask(date) {
  try {
    const response = await fetch("/api/tasks?filter=deadline&date=" + date);
    try {
      const tasksJson = await response.json();
      if (response.ok) {
        return tasksJson;
      } else {
        throw tasksJson;
      }
    } catch {
      throw { error: "Cannot parse server response." };
    }
  } catch {
    throw { error: "Cannot communicate with the server." };
  }
}

async function addNewTask(task) {
  try {
    const response = await fetch("/api/tasks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      return null;
    } else {
      try {
        const responseJSON = await response.json();
        throw responseJSON;
      } catch {
        throw { error: "Cannot parse server response." };
      }
    }
  } catch {
    throw { error: "Cannot communicate with the server" };
  }
}

async function deleteTask(taskID) {
  try {
    const response = await fetch("/api/tasks/" + taskID, {
      method: "DELETE",
    });
    if (response.ok) {
      return null;
    } else {
      try {
        const responseJSON = await response.json();
        throw responseJSON;
      } catch {
        throw { error: "Cannot parse server response." };
      }
    }
  } catch {
    throw { error: "Cannot communicate with the server" };
  }
}

async function editTask(task) {
  const response = await fetch("/api/tasks/" + task.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (response.ok) {
    return null;
  } else {
    try {
      const responseJSON = await response.json();
      throw responseJSON;
    } catch {
      throw { error: "Cannot parse server response." };
    }
  }
}

async function markTask(taskID, isCompleted) {
  const completedTask = { isCompleted: isCompleted };

  const response = await fetch("/api/tasks?completeTaskID=" + taskID, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(completedTask),
  });
  if (response.ok) {
    return null;
  } else {
    try {
      const responseJSON = await response.json();
      throw responseJSON;
    } catch {
      throw { error: "Cannot parse server response." };
    }
  }
}

/*** Users APIs ***/
async function login(credentials) {
  let response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.json();
    throw errDetails;
  }
}

async function getUserInfo() {
  const response = await fetch("api/sessions/current");
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

async function logout() {
  await fetch("/api/sessions/current", { method: "DELETE" });
}

const API = {
  getAllTasks,
  addNewTask,
  getFilteredTask,
  getFilteredDeadlineTask,
  deleteTask,
  editTask,
  markTask,
  login,
  getUserInfo,
  logout,
};
export default API;
