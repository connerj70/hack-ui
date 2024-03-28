export function eventLoader() {
  return [
    {
      id: "1",
      publicKey: "abc",
      name: "Test",
      type: "Scanner",
      lastEvent: { lat: 1, lng: 2, status: "scan" },
    },
    {
      id: "2",
      publicKey: "def",
      name: "Test 2",
      type: "Item",
      lastEvent: { lat: 1, lng: 2, status: "scan" },
    },
  ];
}
