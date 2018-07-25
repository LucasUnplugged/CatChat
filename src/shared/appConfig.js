import uuid from 'node-uuid';

// Get the instance ID from localStorage
let instanceId = localStorage.getItem('ccInstanceId');
if (instanceId) {
    instanceId = JSON.parse(instanceId);
}

const appConfig = {
    id: instanceId ? instanceId : uuid.v4(),
};

// Save the instance ID to localStorage
localStorage.setItem('ccInstanceId', JSON.stringify(appConfig.id));

export default appConfig;
