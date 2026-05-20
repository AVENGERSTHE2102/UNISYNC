const presenceMap = new Map(); // roomId -> Set of userIds (stored as strings)

async function setOnline(roomId, userId) {
  const roomKey = String(roomId);
  if (!presenceMap.has(roomKey)) {
    presenceMap.set(roomKey, new Set());
  }
  presenceMap.get(roomKey).add(String(userId));
}

async function setOffline(roomId, userId) {
  const roomKey = String(roomId);
  if (presenceMap.has(roomKey)) {
    presenceMap.get(roomKey).delete(String(userId));
    if (presenceMap.get(roomKey).size === 0) {
      presenceMap.delete(roomKey);
    }
  }
}

async function getOnline(roomId) {
  const roomKey = String(roomId);
  if (!presenceMap.has(roomKey)) {
    return [];
  }
  return Array.from(presenceMap.get(roomKey));
}

module.exports = {
  setOnline,
  setOffline,
  getOnline,
};
