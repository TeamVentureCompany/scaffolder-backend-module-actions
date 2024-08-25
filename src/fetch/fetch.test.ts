jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import { resolve as resolvePath } from 'path';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { fetchFile } from '@backstage/plugin-scaffolder-node';
import { createTeamVentureCoFetchAction } from './fetch';
import { UrlReaderService } from '@backstage/backend-plugin-api';

describe('teamventureco:fetch', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );
  const reader: UrlReaderService = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const action = createTeamVentureCoFetchAction({ integrations, reader });
  const mockContext = createMockActionContext();

  it('should disallow a target path outside working directory', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          urls: [
            {
              url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
              targetPath: '/foobar',
              token: '',
            },
          ],
        },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('passed through the token to fetchFile', async () => {
    await action.handler({
      ...mockContext,
      input: {
        urls: [
          {
            url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
            token: 'mockToken',
            targetPath: 'lol',
          },
        ],
      },
    });

    expect(fetchFile).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'mockToken' }),
    );
  });

  it('should fetch plain', async () => {
    await action.handler({
      ...mockContext,
      input: {
        urls: [
          {
            url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
            targetPath: 'lol',
            token: '',
          },
        ],
      },
    });
    expect(fetchFile).toHaveBeenCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext.workspacePath, 'lol'),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
      }),
    );
  });
});
