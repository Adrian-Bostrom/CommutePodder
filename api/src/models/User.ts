export class User {
  uid: number;
  favouritePods: number[];
  currentPod: number;
  routeHistory: {startId: number, endId: number}[];
  currentRoute: {startId: number, endId: number};
  favouriteRoutes: {startId: number, endId: number}[];
  ready: boolean;

  constructor(data: {
    uid: number,
    favouritePods?:  number[],
    currentPod?: number,
    routeHistory?: {startId: number, endId: number}[],
    currentRoute?: {startId: number, endId: number},
    favouriteRoutes?: {startId: number, endId: number}[],
    ready?: boolean
  }) {
    this.uid = data.uid;
    this.favouritePods = data. favouritePods || [];
    this.currentPod = data. currentPod || 0;
    this.routeHistory = data.routeHistory || [];
    this.currentRoute = data.currentRoute || {startId: 0, endId: 0};
    this. favouriteRoutes = data.favouriteRoutes || [];
    this.ready = data.ready || false;
  }

  setFavourite(podId: number): void {
    if (! this.favouritePods.includes(podId)) {
      this.favouritePods.push(podId);
    }
  }

  removeFavourite(podId:  number): void {
    this.favouritePods = this.favouritePods.filter(id => id !== podId);
  }

  // Convert to plain object for Firebase
  toFirestore() {
    return {
      uid: this.uid,
      favouritePods: this.favouritePods,
      currentPod: this.currentPod,
      routeHistory: this.routeHistory,
      currentRoute:  this.currentRoute,
      favouriteRoutes: this.favouriteRoutes,
      ready: this.ready
    };
  }

  // Create instance from Firebase data
  static fromFirestore(data: any): User {
    return new User(data);
  }
}