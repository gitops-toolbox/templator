# templator

Template your files

This a tool/library born from the necessity of templating multiple files and pushing them in multiple locations.


# Quick start

Head over to [templator-examples](https://github.com/gitops-toolbox/templator-examples) to try the tool

# Terminology

## Context

The data folder (default to `context`) should only contain folders and `json` files.

The data will be merged as for the logic in the `config-loader` library.

## Mappings

The mappings folder (default to `mappings`) can contain `.json` or `.njk` or `.js` mapping files.

Each mapping files should return a valid object or json with the following content:

```
{
  "locations": [
    {
      "template": "<template-path>",
      "contextSelector": "<context-selector>",
      "tags": {"tagName": "tagValue"},          # Optional
      "destination": { "type": "<destination-type>", ... }
    }
  ]
}
```

## Templates

The templates folder (default to `templates`).
The templates will be rendered by the mappings using [Nunjucks](nunjucks).

# Examples

## List templates

```
> ./bin/cli.js -b examples list templates # listTemplates
[
  "context.njk"
]
```

## list mappings

```
> ./bin/cli.js -b examples list mappings # listMappings
[
  "example.js",
  "example.json",
  "readme.json",
  "nested/example.njk"
]
```

## Show context

Full context

```
> ./bin/cli.js -b examples context # showContext
{
  "dev": {
    "environment": "development",
    "components": {
      "application": {
        "name": "templator"
      },
      "database": {
        "name": "Database"
      }
    }
  },
  "prd": {
    "environment": "production",
    "components": {
      "database": {
        "name": "Database"
      }
    }
  }
}
```

Full context in yaml format

```
> ./bin/cli.js -b examples -o yaml context # showYamlContext
dev:
  environment: development
  components:
    application:
      name: templator
    database:
      name: Database
prd:
  environment: production
  components:
    database:
      name: Database

```

Using context-selector

```
> ./bin/cli.js -b examples context dev.components.application # showContextSelector
{
  "name": "templator"
}
```

Using context-selector as json

```
> ./bin/cli.js -b examples context '["dev", "components", "application"]' # showContextSelectorJson
{
  "name": "templator"
}
```

## Render mapping

```
> ./bin/cli.js -b examples generate --just-mapping nested/example.njk dev # renderMapping
{
  "mapping": {
    "locations": [
      {
        "template": "context.njk",
        "contextSelector": "components.application",
        "destination": {
          "type": "echo",
          "params": {
            "repo": "myorg/development",
            "filepath": "application.json"
          }
        },
        "tags": {
          "type": "application"
        },
        "templateContext": {
          "name": "templator"
        }
      },
      {
        "template": "context.njk",
        "contextSelector": "components.database",
        "destination": {
          "type": "echo",
          "params": {
            "repo": "myorg/development",
            "filepath": "database.json"
          }
        },
        "tags": {
          "type": "database"
        },
        "templateContext": {
          "name": "Database"
        }
      }
    ]
  },
  "context": {
    "environment": "development",
    "components": {
      "application": {
        "name": "templator"
      },
      "database": {
        "name": "Database"
      }
    }
  }
}
```

## Render template

```
> ./bin/cli.js -b examples generate -o json nested/example.njk dev # renderTemplate
{
  "locations": [
    {
      "template": "context.njk",
      "contextSelector": "components.application",
      "destination": {
        "type": "echo",
        "params": {
          "repo": "myorg/development",
          "filepath": "application.json"
        }
      },
      "tags": {
        "type": "application"
      },
      "templateContext": {
        "name": "templator"
      },
      "renderedTemplate": "# Template file templates/context.njk\n# Mapping file mappings/nested/example.njk\n\n{\"name\":\"templator\"}\n"
    },
    {
      "template": "context.njk",
      "contextSelector": "components.database",
      "destination": {
        "type": "echo",
        "params": {
          "repo": "myorg/development",
          "filepath": "database.json"
        }
      },
      "tags": {
        "type": "database"
      },
      "templateContext": {
        "name": "Database"
      },
      "renderedTemplate": "# Template file templates/context.njk\n# Mapping file mappings/nested/example.njk\n\n{\"name\":\"Database\"}\n"
    }
  ]
}
```

## Render human readable

```
> ./bin/cli.js -b examples generate nested/example.njk dev -h # renderHumanReadable
---
{"destination":{"type":"echo","params":{"repo":"myorg/development","filepath":"application.json"}},"tags":{"type":"application"}}
---
# Template file templates/context.njk
# Mapping file mappings/nested/example.njk

{"name":"templator"}

---
{"destination":{"type":"echo","params":{"repo":"myorg/development","filepath":"database.json"}},"tags":{"type":"database"}}
---
# Template file templates/context.njk
# Mapping file mappings/nested/example.njk

{"name":"Database"}

```

## Render human readable limit to one file

```
> ./bin/cli.js -b examples generate nested/example.njk dev -h --limit-to '{"type": "database"}' # renderHumanReadableLimitTo
---
{"destination":{"type":"echo","params":{"repo":"myorg/development","filepath":"database.json"}},"tags":{"type":"database"}}
---
# Template file templates/context.njk
# Mapping file mappings/nested/example.njk

{"name":"Database"}

```

## Persist templates

```
./bin/cli.js -b examples generate nested/example.njk dev --persist # persist
{
  "echo": {
    "templates": [
      {
        "template": "context.njk",
        "contextSelector": "components.application",
        "destination": {
          "type": "echo",
          "params": {
            "repo": "myorg/development",
            "filepath": "application.json"
          }
        },
        "tags": {
          "type": "application"
        },
        "templateContext": {
          "name": "templator"
        },
        "renderedTemplate": "# Template file templates/context.njk\n# Mapping file mappings/nested/example.njk\n\n{\"name\":\"templator\"}\n"
      },
      {
        "template": "context.njk",
        "contextSelector": "components.database",
        "destination": {
          "type": "echo",
          "params": {
            "repo": "myorg/development",
            "filepath": "database.json"
          }
        },
        "tags": {
          "type": "database"
        },
        "templateContext": {
          "name": "Database"
        },
        "renderedTemplate": "# Template file templates/context.njk\n# Mapping file mappings/nested/example.njk\n\n{\"name\":\"Database\"}\n"
      }
    ]
  }
}
```

## Render human readable limit to one file and hide header

```
> ./bin/cli.js -b examples generate nested/example.njk dev -h --limit-to '{"type": "database"}' --hide-headers # renderFileContent
# Template file templates/context.njk
# Mapping file mappings/nested/example.njk

{"name":"Database"}

```

## Show help

```
> ./bin/cli.js --help # showHelp
cli.js <command>

Commands:
  cli.js context [context-selector]             Output the full context
  cli.js generate <mapping> [context-selector]  Output the rendered templates
  cli.js list <target>                          List one between templates and mappings

Options:
      --help           Show help  [boolean]
      --version        Show version number  [boolean]
  -b, --base-dir       path where to find the config  [string] [default: "."]
      --context-dir    directory name of the context folder  [string] [default: "context"]
      --mappings-dir   directory where to search for mappings  [string] [default: "mappings"]
      --templates-dir  directory where to find the templates  [string] [default: "templates"]
```
