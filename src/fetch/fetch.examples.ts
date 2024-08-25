import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description:
      'Downloads many files and places them in the workspace. An optional token can be passed for private repositories.',
    example: yaml.stringify({
      steps: [
        {
          action: 'teamventureco:fetch',
          id: 'fetch-files',
          name: 'Fetch files',
          input: {
            urls: [
              {
                url: 'https://github.com/backstage/backstage/blob/master/.editorconfig',
                targetPath: '.editorconfig',
              },
              {
                url: 'https://github.com/backstage/backstage/blob/master/docs/publishing.md',
                targetPath: 'docs/publishing.md',
              },
              {
                url: 'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
                targetPath: 'catalog-info.yaml',
                token: '${{ secrets.USER_OAUTH_TOKEN }}',
              },
            ],
          },
        },
      ],
    }),
  },
];
