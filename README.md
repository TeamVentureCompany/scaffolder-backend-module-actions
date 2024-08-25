# scaffolder-backend-module-actions

Welcome to the Team Venture Co action repository for the Backstage `scaffolder-backend`.

This plugin contains a single action currently, but more will be added as time allows.

- `teamventureco:fetch`

## Getting started

You need to configure the actions in your backend:

## From your Backstage root directory

```sh
# From your Backstage root directory
yarn --cwd packages/backend add @team-venture-company/backstage-plugin-scaffolder-backend-module-actions
```

Configure the actions (you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions/#register-action-with-new-backend-system) to see all options):

```typescript
// packages/backend/src/index.ts
const backend = createBackend();

// ...

backend.add(
  import(
    '@team-venture-company/backstage-plugin-scaffolder-backend-module-actions'
  ),
);
```

The `teamventureco:fetch` custom action leverages the built-in `fetchFile` function from the `@backstage/plugin-scaffolder-node`
package to streamline the process of retrieving files from external sources. The `fetchFile` function supports fetching
content from a variety of URL types, including Git repositories and HTTP(S) endpoints, and seamlessly integrates with
Backstage's URL reader service. This ensures robust handling of different SCM integrations and protocols, while also
supporting authenticated requests via optional tokens. By using `fetchFile`, the action not only simplifies the
retrieval of files but also provides safety mechanisms such as secure path resolution and compatibility with
Backstage’s URL reading infrastructure.

## Using the template

After loading and configuring the actions, you can use it in your template:

```yaml
# template.yaml

apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: example-template
  title: Example Template
  description: Show how to fetch multiple files and add them to a repository
spec:
  owner: teamventureco-c
  type: service

  parameters:
    - title: Application Destination
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          description: Location the files will be stored
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com

  steps:
    - id: fetch
      name: Fetch Files
      action: teamventureco:fetch
      input:
        urls:
          # Put the file in the root of the project under a new name.
          - url: https://github.com/backstage/backstage/blob/master/.editorconfig
            targetPath: .editorconfig
          # Deeply nest the file.
          - url: https://github.com/backstage/backstage/blob/master/docs/publishing.md
            targetPath: docs/publishing.md
          # Can pass a token to the underlying private repo.
          - url: https://github.com/backstage/some/private/file.go
            targetPath: my/file.go
            token: ${{ secrets.USER_OAUTH_TOKEN }}

    - id: publish
      name: Publish
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: This is the description
        repoUrl: ${{ parameters.repoUrl }}
        defaultBranch: main

  output:
    links:
      - title: Repository
        url: ${{ steps['publish'].output.remoteUrl }}
```

You can find a list of all registered actions including their parameters at the `/create/actions` route in your Backstage application.
