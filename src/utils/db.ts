const DB_NAME = 'ExpenseManagerDB';
const DB_VERSION = 1;

export interface Transaction {
  id?: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes: string;
  timestamp: number;
}

export interface Category {
  id?: number;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  isDefault: boolean;
}

export interface Budget {
  id?: number;
  month: string;
  limit: number;
}

export interface Settings {
  id?: number;
  darkMode: boolean;
  currency: string;
}

class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', {
            keyPath: 'id',
            autoIncrement: true,
          });
          transactionStore.createIndex('date', 'date', { unique: false });
          transactionStore.createIndex('category', 'category', { unique: false });
          transactionStore.createIndex('type', 'type', { unique: false });
          transactionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('categories')) {
          const categoryStore = db.createObjectStore('categories', {
            keyPath: 'id',
            autoIncrement: true,
          });
          categoryStore.createIndex('name', 'name', { unique: false });
          categoryStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('budgets')) {
          const budgetStore = db.createObjectStore('budgets', {
            keyPath: 'id',
            autoIncrement: true,
          });
          budgetStore.createIndex('month', 'month', { unique: true });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  }

  async addTransaction(transaction: Transaction): Promise<number> {
    const tx = this.db!.transaction(['transactions'], 'readwrite');
    const store = tx.objectStore('transactions');
    const request = store.add(transaction);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    const tx = this.db!.transaction(['transactions'], 'readwrite');
    const store = tx.objectStore('transactions');
    const request = store.put(transaction);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    const tx = this.db!.transaction(['transactions'], 'readwrite');
    const store = tx.objectStore('transactions');
    const request = store.delete(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const tx = this.db!.transaction(['transactions'], 'readonly');
    const store = tx.objectStore('transactions');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addCategory(category: Category): Promise<number> {
    const tx = this.db!.transaction(['categories'], 'readwrite');
    const store = tx.objectStore('categories');
    const request = store.add(category);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async updateCategory(category: Category): Promise<void> {
    const tx = this.db!.transaction(['categories'], 'readwrite');
    const store = tx.objectStore('categories');
    const request = store.put(category);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCategory(id: number): Promise<void> {
    const tx = this.db!.transaction(['categories'], 'readwrite');
    const store = tx.objectStore('categories');
    const request = store.delete(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCategories(): Promise<Category[]> {
    const tx = this.db!.transaction(['categories'], 'readonly');
    const store = tx.objectStore('categories');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async setBudget(budget: Budget): Promise<number> {
    const tx = this.db!.transaction(['budgets'], 'readwrite');
    const store = tx.objectStore('budgets');
    const index = store.index('month');
    const existing = await new Promise<Budget | undefined>((resolve) => {
      const request = index.get(budget.month);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
    });

    if (existing) {
      budget.id = existing.id;
      const updateRequest = store.put(budget);
      return new Promise((resolve, reject) => {
        updateRequest.onsuccess = () => resolve(updateRequest.result as number);
        updateRequest.onerror = () => reject(updateRequest.error);
      });
    } else {
      const addRequest = store.add(budget);
      return new Promise((resolve, reject) => {
        addRequest.onsuccess = () => resolve(addRequest.result as number);
        addRequest.onerror = () => reject(addRequest.error);
      });
    }
  }

  async getBudget(month: string): Promise<Budget | undefined> {
    const tx = this.db!.transaction(['budgets'], 'readonly');
    const store = tx.objectStore('budgets');
    const index = store.index('month');
    const request = index.get(month);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<Settings | undefined> {
    const tx = this.db!.transaction(['settings'], 'readonly');
    const store = tx.objectStore('settings');
    const request = store.get(1);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateSettings(settings: Settings): Promise<void> {
    const tx = this.db!.transaction(['settings'], 'readwrite');
    const store = tx.objectStore('settings');
    settings.id = 1;
    const request = store.put(settings);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async exportData(): Promise<string> {
    const transactions = await this.getAllTransactions();
    const categories = await this.getAllCategories();
    const settings = await this.getSettings();

    const data = {
      transactions,
      categories,
      settings,
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);

    if (data.transactions) {
      const tx = this.db!.transaction(['transactions'], 'readwrite');
      const store = tx.objectStore('transactions');
      await new Promise<void>((resolve) => {
        store.clear();
        tx.oncomplete = () => resolve();
      });

      for (const transaction of data.transactions) {
        delete transaction.id;
        await this.addTransaction(transaction);
      }
    }

    if (data.categories) {
      const tx = this.db!.transaction(['categories'], 'readwrite');
      const store = tx.objectStore('categories');
      await new Promise<void>((resolve) => {
        store.clear();
        tx.oncomplete = () => resolve();
      });

      for (const category of data.categories) {
        delete category.id;
        await this.addCategory(category);
      }
    }

    if (data.settings) {
      await this.updateSettings(data.settings);
    }
  }
}

export const db = new Database();
