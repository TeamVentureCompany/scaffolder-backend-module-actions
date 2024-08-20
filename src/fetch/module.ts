import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createTeamVentureCoFetchAction } from './fetch';
import { ScmIntegrations } from '@backstage/integration';

/**
 * A backend module that registers the action into the scaffolder
 */
export const scaffolderModuleTeamVentureCoFetch = createBackendModule({
  moduleId: 'teamventureco:fetch',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        config: coreServices.rootConfig,
        reader: coreServices.urlReader,
        scaffolderActions: scaffolderActionsExtensionPoint,
      },
      async init({ config, reader, scaffolderActions }) {
        const integrations = ScmIntegrations.fromConfig(config);
        scaffolderActions.addActions(
          createTeamVentureCoFetchAction({ reader, integrations }),
        );
      },
    });
  },
});
