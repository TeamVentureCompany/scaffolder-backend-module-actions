import {
  createTemplateAction,
  fetchFile,
} from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';
import {
  resolveSafeChildPath,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { examples } from './fetch.examples';

export function createTeamVentureCoFetchAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
}) {
  const { reader, integrations } = options;

  return createTemplateAction<{
    urls: Array<{
      url: string;
      targetPath: string;
      token: string;
    }>;
  }>({
    id: 'teamventureco:fetch',
    description: 'Fetch multiple URLs into a workspace',
    examples,
    schema: {
      input: {
        required: ['urls'],
        type: 'object',
        properties: {
          urls: {
            title: 'List of URLs',
            description:
              'Downloads multiple files and places them in the workspace.',
            type: 'array',
            items: {
              type: 'object',
              required: ['url', 'targetPath'],
              properties: {
                url: {
                  type: 'string',
                  title:
                    'Relative path or absolute URL pointing to the single file to fetch.',
                },
                targetPath: {
                  type: 'string',
                  title:
                    'Target path within the working directory to download the file as.',
                },
                token: {
                  type: 'string',
                  title:
                    'An optional token to use for authentication when reading the resources.',
                },
              },
            },
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching content from remote URL');

      if (!Array.isArray(ctx.input?.urls)) {
        throw new InputError('urls must be an Array');
      }

      for (const item of ctx.input.urls) {
        const targetPath = item.targetPath ?? './';
        const outputPath = resolveSafeChildPath(ctx.workspacePath, targetPath);

        await fetchFile({
          reader,
          integrations,
          fetchUrl: item.url,
          outputPath,
          token: item?.token,
        });
      }
    },
  });
}
