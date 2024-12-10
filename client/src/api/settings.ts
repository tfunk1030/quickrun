import Api from './Api';

interface SettingsUpdateResponse {
  message: string;
  settings: {
    autoRunAfterBuild: boolean;
    darkMode: boolean;
  };
}

interface SettingsUpdateData {
  autoRunAfterBuild: boolean;
  darkMode: boolean;
}

export const updateSettings = async (data: SettingsUpdateData): Promise<SettingsUpdateResponse> => {
  try {
    const response = await Api.put<SettingsUpdateResponse>('/settings', data);
    console.log('Settings updated successfully:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};