# Azure Mailer

## INSTALLATION

1. Enable the module
2. Set your Azure Communication Services endpoint url at
  /admin/config/config/azure_mailer

3. Set your secret access key with settings.php or manually with drush.
  It can't be read or modified from the UI.
  Example:
    $config['azure_mailer.settings']['secret'] = getenv('AZURE_COMM_SECRET');
    $config['azure_mailer.settings']['endpoint'] = getenv('AZURE_COMM_ENDPOINT');

4. Change your default mailer to Azure Communication Services Mailer at
  /admin/config/system/mailsystem
