/**
 * Sync Status Alert Component
 * Displays different alert types based on sync result
 */

interface SyncStatusAlertProps {
  syncResult: {
    data?: {
      success: boolean;
      usingMockData: boolean;
      hostawayError: {
        type: string;
        message: string;
        isRecoverable: boolean;
      } | null;
      summary: {
        new: number;
        updated: number;
        errors: number;
        total: number;
      };
    };
    serverError?: string;
  } | null;
}

export function SyncStatusAlert({ syncResult }: SyncStatusAlertProps) {
  if (!syncResult) return null;

  // Error state - API failed completely
  if (syncResult.serverError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Sync Failed
            </h3>
            <div className="text-sm text-red-700 space-y-2">
              <p className="font-medium">{syncResult.serverError}</p>
              {syncResult.data?.hostawayError?.isRecoverable && (
                <div className="bg-red-100 rounded p-2 mt-2">
                  <p className="text-xs">
                    💡 <strong>This error may be temporary.</strong> Please try again in a few moments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Warning state - Using mock data
  if (syncResult.data?.hostawayError && syncResult.data.usingMockData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Sync Completed with Mock Data
            </h3>
            <div className="text-sm text-yellow-700 space-y-3">
              {/* Error Message */}
              <div className="bg-yellow-100 rounded p-3">
                <p className="font-medium text-yellow-900">
                  {syncResult.data.hostawayError.message}
                </p>
              </div>

              {/* Results Summary */}
              <div className="border-t border-yellow-200 pt-3">
                <p className="font-medium mb-2 text-yellow-900">Sync Results:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-yellow-600">New Reviews</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {syncResult.data.summary.new}
                    </p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-yellow-600">Updated</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {syncResult.data.summary.updated}
                    </p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-yellow-600">Errors</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {syncResult.data.summary.errors}
                    </p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-yellow-600">Total</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {syncResult.data.summary.total}
                    </p>
                  </div>
                </div>
              </div>

              {/* Configuration Help */}
              <div className="bg-yellow-100 rounded p-3">
                <p className="text-xs font-medium text-yellow-900 mb-2">
                  📝 To use real Hostaway data:
                </p>
                <ol className="list-decimal list-inside text-xs space-y-1 ml-2">
                  <li>Add your Hostaway API credentials to <code className="bg-yellow-200 px-1 rounded">.env.local</code></li>
                  <li>Set <code className="bg-yellow-200 px-1 rounded">HOSTAWAY_CLIENT_ID</code></li>
                  <li>Set <code className="bg-yellow-200 px-1 rounded">HOSTAWAY_CLIENT_SECRET</code></li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - Real API data
  if (syncResult.data?.success && !syncResult.data.hostawayError) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              Sync Completed Successfully
            </h3>
            <div className="text-sm text-green-700 space-y-3">
              {/* Results Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-white rounded p-2">
                  <p className="text-xs text-green-600">New Reviews</p>
                  <p className="text-lg font-bold text-green-900">
                    {syncResult.data.summary.new}
                  </p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-xs text-green-600">Updated</p>
                  <p className="text-lg font-bold text-green-900">
                    {syncResult.data.summary.updated}
                  </p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-xs text-green-600">Errors</p>
                  <p className="text-lg font-bold text-green-900">
                    {syncResult.data.summary.errors}
                  </p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-xs text-green-600">Total Processed</p>
                  <p className="text-lg font-bold text-green-900">
                    {syncResult.data.summary.total}
                  </p>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-green-100 rounded p-2">
                <p className="text-xs">
                  🎉 Reviews have been successfully synced from Hostaway API
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

