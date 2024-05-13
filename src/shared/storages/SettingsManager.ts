import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export interface FeatureSettings {
  openNewPageAutoToggle: boolean;
  lazyModeToggle: boolean;
  annotateTargetLanguageToggle: boolean;
  annotateTargetLanguageType: string;
  annotateSourceLanguageToggle: boolean;
  annotateSourceLanguageType: string;
  websiteRules: Array<{ website: string; rule: string }>;
  useUnderline: boolean;
  useTextHighlight: boolean;
  annotateFrequency: number;
  useBold: boolean;
}

export interface UserSettings {
  sourceLanguage: string;
  targetLanguage: string;
  hasInitChoose: boolean;
  token: string;
  featureSettings: FeatureSettings;
}

class SettingsManager {
  private static instance: SettingsManager;
  private settingsStorage: BaseStorage<UserSettings>;

  private constructor() {
    const defaultSettings: UserSettings = {
      sourceLanguage: 'zh',
      targetLanguage: 'en',
      hasInitChoose: false,
      token: '',
      featureSettings: {
        openNewPageAutoToggle: false,
        lazyModeToggle: false,
        annotateTargetLanguageToggle: false,
        annotateTargetLanguageType: '',
        annotateSourceLanguageToggle: false,
        annotateSourceLanguageType: '',
        websiteRules: [],
        useUnderline: false,
        useTextHighlight: false,
        annotateFrequency: 0,
        useBold: false,
      },
    };

    this.settingsStorage = createStorage<UserSettings>('userSettings', defaultSettings, {
      storageType: StorageType.Local,
    });

    this.loadSettings();
  }

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  async loadSettings(): Promise<UserSettings> {
    const settings = await this.settingsStorage.get();
    console.log('Settings loaded:', settings);
    return settings;
  }

  async saveSettings(newSettings: UserSettings): Promise<void> {
    await this.settingsStorage.set(newSettings);
    console.log('Settings saved!');
  }

  async updateSettings(update: Partial<UserSettings>): Promise<void> {
    const settings = await this.loadSettings();
    await this.saveSettings({ ...settings, ...update });
  }

  async updateFeatureSettings(update: Partial<FeatureSettings>): Promise<void> {
    const settings = await this.loadSettings();
    await this.saveSettings({ ...settings, featureSettings: { ...settings.featureSettings, ...update } });
  }
}

export const settingsManager = SettingsManager.getInstance();
