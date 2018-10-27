export function arrayFromSnapshot(snapshot: firebase.firestore.QuerySnapshot) {
  let items: any[] = [];

  snapshot.forEach(item => {
    items.push({ ...item.data(), id: item.id });
  });

  return items;
}
