import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  collection,
  collectionData,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  CollectionReference,
  Query,
  where,
  orderBy,
  limit,
  FieldValue,
  serverTimestamp,
  deleteField,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// --- Interfaces for common data structures (optional, but good practice) ---
export interface FirestoreDocument {
  id?: string; // Optional: ID is often handled separately or added after retrieval
  createdAt?: FieldValue | Timestamp;
  updatedAt?: FieldValue | Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore: Firestore = inject(Firestore);

  constructor() { }

  private isValidPath(path: string, type: 'document' | 'collection'): boolean {
    if (!path || typeof path !== 'string' || path.trim() === '') {
      throw new Error('Firestore path cannot be empty or null.');
    }

    const segments = path.split('/').filter(segment => segment.trim() !== '');

    if (segments.length === 0) {
      throw new Error('Firestore path must contain at least one segment.');
    }

    if (type === 'document') {
      if (segments.length % 2 !== 0) {
        throw new Error(
          `Invalid document path: '${path}'. Document paths must have an even number of segments (e.g., collection/documentId).`
        );
      }
    } else if (type === 'collection') {
      if (segments.length % 2 === 0) {
        throw new Error(
          `Invalid collection path: '${path}'. Collection paths must have an odd number of segments (e.g., collectionName or collection/documentId/subCollection).`
        );
      }
    }
    return true;
  }

  // --- Common Document Operations ---

  /**
   * Retrieves a single document from Firestore.
   * @param path Path to the document (e.g., 'users/userId').
   * @returns Observable of the document data (typed as T). Includes 'id' field.
   */
  getDoc<T extends FirestoreDocument>(path: string): Observable<T | undefined> {
    this.isValidPath(path, 'document');
    const docRef = doc(this.firestore, path) as DocumentReference<T>;
    return docData<T>(docRef, { idField: 'id' }) as Observable<T | undefined>;
  }

  /**
   * Adds a new document to a collection with a Firestore-generated ID.
   * Includes 'createdAt' and 'updatedAt' server timestamps.
   * @param collectionPath Path to the collection (e.g., 'users').
   * @param data The document data (typed as T).
   * @returns Promise resolving with the DocumentReference of the newly created document.
   */
  addDocToCollection<T extends object>(collectionPath: string, data: T): Promise<DocumentReference<T>> {
    this.isValidPath(collectionPath, 'collection');
    const collRef = collection(this.firestore, collectionPath) as CollectionReference<T>;
    const dataWithTimestamps = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return addDoc(collRef, dataWithTimestamps);
  }

  /**
   * Sets (creates or overwrites) a document at a specific path with a custom ID.
   * If the document exists, it's overwritten. If not, it's created.
   * Use `updateDoc` for partial updates to existing documents.
   * Includes 'createdAt' (on create) and 'updatedAt' server timestamps.
   * @param docPath Path to the document (e.g., 'users/customUserId').
   * @param data The document data (typed as T).
   * @param merge If true, merges data with existing document (similar to update, but creates if not exists).
   * If false (default), overwrites the document.
   * @returns Promise resolving when the set operation is complete.
   */
  setDoc<T extends object>(docPath: string, data: T, merge: boolean = false): Promise<void> {
    this.isValidPath(docPath, 'document');
    const docRef = doc(this.firestore, docPath);
    const dataWithTimestamps: any = { // Use any for flexibility with serverTimestamp
      ...data,
      updatedAt: serverTimestamp(),
    };
    if (!merge || !docRef) { // Simplified check, ideally check existence for createdAt
        dataWithTimestamps.createdAt = serverTimestamp();
    }
    return setDoc(docRef, dataWithTimestamps, { merge });
  }


  /**
   * Updates an existing document in Firestore.
   * Fails if the document does not exist.
   * Includes 'updatedAt' server timestamp.
   * @param path Path to the document (e.g., 'users/userId').
   * @param data Partial data to update (typed as Partial<T>).
   * @returns Promise resolving when the update is complete.
   */
  updateDoc<T extends object>(path: string, data: Partial<T>): Promise<void> {
    this.isValidPath(path, 'document');
    const docRef = doc(this.firestore, path);
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    return updateDoc(docRef, dataWithTimestamp);
  }

  /**
   * Deletes a document from Firestore.
   * Note: Deleting a document does NOT delete its subcollections.
   * @param path Path to the document (e.g., 'users/userId').
   * @returns Promise resolving when the delete operation is complete.
   */
  deleteDoc(path: string): Promise<void> {
    this.isValidPath(path, 'document');
    const docRef = doc(this.firestore, path);
    return deleteDoc(docRef).catch(this.handleErrorPromise);
  }

  // --- Common Collection Operations ---

  /**
   * Retrieves a collection from Firestore.
   * @param path Path to the collection (e.g., 'users').
   * @param queryFn Optional function to apply Firestore queries (e.g., where, orderBy, limit).
   * @returns Observable of an array of documents (typed as T[]). Includes 'id' field for each doc.
   *
   * @example
   * // Get all users
   * this.firestoreService.getCollection<User>('users');
   *
   * // Get active users, ordered by name, limit 10
   * this.firestoreService.getCollection<User>('users', ref =>
   * query(ref, where('active', '==', true), orderBy('name'), limit(10))
   * );
   */
  getCollection<T extends FirestoreDocument>(
    path: string,
    queryFn?: (ref: CollectionReference<T>) => Query<T>
  ): Observable<T[]> {
    this.isValidPath(path, 'collection');
    let collectionRef = collection(this.firestore, path) as CollectionReference<T>;

    if (queryFn) {
      return collectionData<T>(queryFn(collectionRef), { idField: 'id' }) as Observable<T[]>;
    }
    return collectionData<T>(collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Deletes all documents in a collection.
   * This is a potentially expensive operation and should be used with caution,
   * especially on large collections. It's often better to handle deletions
   * in a more controlled manner or use Firebase Cloud Functions for bulk deletes.
   * This function fetches all documents and then deletes them one by one.
   * @param collectionPath Path to the collection (e.g., 'adminLogs').
   * @returns Promise resolving when all documents in the collection are deleted.
   */
  async deleteCollection(collectionPath: string): Promise<void> {
    this.isValidPath(collectionPath, 'collection');
    console.warn(`Attempting to delete all documents in collection: '${collectionPath}'. This can be a slow and costly operation.`);

    const collectionRef = collection(this.firestore, collectionPath);
    const L = await import('firebase/firestore'); // Dynamically import to get 'getDocs' and 'writeBatch'
    const querySnapshot = await L.getDocs(collectionRef);

    if (querySnapshot.empty) {
      console.log(`Collection '${collectionPath}' is already empty or does not exist.`);
      return Promise.resolve();
    }

    const batch = L.writeBatch(this.firestore);
    querySnapshot.forEach(docSnapshot => {
      batch.delete(docSnapshot.ref);
    });

    return batch.commit().then(() => {
      console.log(`Successfully deleted all documents in collection: '${collectionPath}'.`);
    }).catch(error => {
      console.error(`Error deleting collection '${collectionPath}': `, error);
      throw error; // Re-throw to allow further handling
    });
  }


  // --- Utility Functions for FieldValue operations (often used in updates) ---

  /**
   * Returns a server-generated timestamp.
   */
  getServerTimestamp(): FieldValue {
    return serverTimestamp();
  }

  /**
   * Returns a special value that can be used with updateDoc to delete a field from a document.
   */
  deleteFieldValue(): FieldValue {
    return deleteField();
  }

  /**
   * Returns a special value that can be used with updateDoc to increment a numeric field.
   * @param value The value to increment by (can be negative).
   */
  incrementFieldValue(value: number): FieldValue {
    return increment(value);
  }

  /**
   * Returns a special value that can be used with updateDoc to add an element to an array field.
   * @param elements The elements to add.
   */
  arrayUnionFieldValue(...elements: any[]): FieldValue {
    return arrayUnion(...elements);
  }

  /**
   * Returns a special value that can be used with updateDoc to remove an element from an array field.
   * @param elements The elements to remove.
   */
  arrayRemoveFieldValue(...elements: any[]): FieldValue {
    return arrayRemove(...elements);
  }


  // --- Error Handling ---
  private handleError<T>(error: any): Observable<T> {
    console.error('Firestore operation error:', error);
    // You could transform the error or log to a remote service here
    return throwError(() => new Error(`Firestore error: ${error.message || 'Unknown error'}`));
  }

  private handleErrorPromise(error: any): Promise<never> {
    console.error('Firestore operation error (Promise):', error);
    return Promise.reject(new Error(`Firestore error: ${error.message || 'Unknown error'}`));
  }
}
