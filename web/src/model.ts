
export interface RouteType {
  startId: number;
  endId: number;
}

export interface UserData {
  uid:  number;
  favouritePods: number[];
  currentPod: number;
  routeHistory: RouteType[];
  currentRoute: RouteType;
  favouriteRoutes: RouteType[];
  ready: boolean;
}

export class User {
  uid: number;
  favouritePods:  number[];
  currentPod:  number;
  routeHistory:  RouteType[];
  currentRoute: RouteType;
  favouriteRoutes: RouteType[];
  ready: boolean;

  constructor(data:  Partial<UserData> & { uid: number }) {
    this.uid = data.uid;
    this.favouritePods = data.favouritePods || [];
    this.currentPod = data.currentPod || 0;
    this.routeHistory = data.routeHistory || [];
    this.currentRoute = data.currentRoute || { startId: 0, endId: 0 };
    this.favouriteRoutes = data.favouriteRoutes || [];
    this.ready = data.ready || false;
  }

  // Add a pod to favourites
  addFavouritePod(podId:  number): void {
    if (!this.favouritePods. includes(podId)) {
      this.favouritePods.push(podId);
    }
  }

  // Remove a pod from favourites
  removeFavouritePod(podId:  number): void {
    this.favouritePods = this.favouritePods.filter(id => id !== podId);
  }

  // Check if a pod is favourited
  isFavouritePod(podId: number): boolean {
    return this. favouritePods.includes(podId);
  }

  // Set current pod
  setCurrentPod(podId: number): void {
    this.currentPod = podId;
  }

  // Set current route
  setCurrentRoute(startId: number, endId: number): void {
    this.currentRoute = { startId, endId };
  }

  // Add a route to favourites
  addFavouriteRoute(startId: number, endId: number): void {
    const routeExists = this.favouriteRoutes.some(
      route => route.startId === startId && route.endId === endId
    );
    if (!routeExists) {
      this.favouriteRoutes.push({ startId, endId });
    }
  }

  // Remove a route from favourites
  removeFavouriteRoute(startId: number, endId: number): void {
    this.favouriteRoutes = this.favouriteRoutes.filter(
      route => !(route.startId === startId && route.endId === endId)
    );
  }

  // Check if a route is favourited
  isFavouriteRoute(startId: number, endId: number): boolean {
    return this.favouriteRoutes.some(
      route => route.startId === startId && route.endId === endId
    );
  }

  // Add a route to history
  addToRouteHistory(startId: number, endId: number): void {
    this.routeHistory. push({ startId, endId });
  }

  // Clear route history
  clearRouteHistory(): void {
    this.routeHistory = [];
  }

  // Set ready status
  setReady(ready: boolean): void {
    this.ready = ready;
  }

  // Toggle ready status
  toggleReady(): void {
    this.ready = ! this.ready;
  }

  // Convert to plain object (for API calls/Firebase)
  toJSON(): UserData {
    return {
      uid: this.uid,
      favouritePods:  this.favouritePods,
      currentPod: this.currentPod,
      routeHistory: this.routeHistory,
      currentRoute: this.currentRoute,
      favouriteRoutes:  this.favouriteRoutes,
      ready: this.ready
    };
  }

  // Convert to Firestore format (same as toJSON but explicit naming)
  toFirestore(): UserData {
    return this.toJSON();
  }

  // Create User instance from plain object (from API/Firebase)
  static fromJSON(data: any): User {
    return new User(data);
  }

  // Create User instance from Firestore data (same as fromJSON but explicit naming)
  static fromFirestore(data: any): User {
    return new User(data);
  }

  // Clone the user object
  clone(): User {
    return new User(this. toJSON());
  }
}