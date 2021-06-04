# templator

Template your files

This a tool/library born from the necessity of templating multiple files in multiple locations.

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
      "destinations": [                         # Optional
        { "type": "<destination-type>", ... }
      ]
      "tags": {
        "name": "value"
      }
    }
  ]
}
```

## Templates

The templates folder (default to `templates`).
The templates will be rendered by the mappings using [Nunjucks](nunjucks).


# Examples

## Show context

Full context

```
> ./bin/cli.js -b examples context # showContext
{
  "components": {
    "application": {
      "name": "templator"
    },
    "database": {
      "name": "Database"
    }
  }
}
```

Using context-selector

```
> ./bin/cli.js -b examples context components.application # showContextSelector
{
  "name": "templator"
}
```

Using context-selector as json

```
> ./bin/cli.js -b examples context '["components", "application"]' # showContextSelectorJson
{
  "name": "templator"
}
```

## Render mapping

```
> ./bin/cli.js -b examples render --mapping-only example.njk # renderMapping
{
  "mapping": {
    "locations": [
      {
        "template": "context.njk",
        "contextSelector": "components.application",
        "destinations": [
          {
            "type": "github",
            "repo": "LucaLanziani/application"
          }
        ],
        "tags": {
          "type": "application"
        }
      },
      {
        "template": "context.njk",
        "contextSelector": "components.database",
        "destinations": [
          {
            "type": "github",
            "repo": "LucaLanziani/database"
          }
        ],
        "tags": {
          "type": "database"
        }
      }
    ]
  },
  "context": {
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
> ./bin/cli.js -b examples render example.njk # renderTemplate
{
  "locations": [
    {
      "template": "context.njk",
      "contextSelector": "components.application",
      "destinations": [
        {
          "type": "github",
          "repo": "LucaLanziani/application"
        }
      ],
      "tags": {
        "type": "application"
      },
      "renderedTemplate": "# Template file templates/context.njk\n# Mapping file mappings/example.njk\n\n{\"name\":\"templator\"}\n"
    },
    {
      "template": "context.njk",
      "contextSelector": "components.database",
      "destinations": [
        {
          "type": "github",
          "repo": "LucaLanziani/database"
        }
      ],
      "tags": {
        "type": "database"
      },
      "renderedTemplate": "# Template file templates/context.njk\n# Mapping file mappings/example.njk\n\n{\"name\":\"Database\"}\n"
    }
  ]
}
```

## Render human readable

```
> ./bin/cli.js -b examples render example.njk -h # renderHumanReadable
---
{"destinations":[{"type":"github","repo":"LucaLanziani/application"}],"tags":{"type":"application"}}
---
# Template file templates/context.njk
# Mapping file mappings/example.njk

{"name":"templator"}

---
{"destinations":[{"type":"github","repo":"LucaLanziani/database"}],"tags":{"type":"database"}}
---
# Template file templates/context.njk
# Mapping file mappings/example.njk

{"name":"Database"}

```

## Render human readable limit to one file

```
> ./bin/cli.js -b examples render example.njk -h --limit-to '{"type": "database"}' # renderHumanReadableLimitTo
---
{"destinations":[{"type":"github","repo":"LucaLanziani/database"}],"tags":{"type":"database"}}
---
# Template file templates/context.njk
# Mapping file mappings/example.njk

{"name":"Database"}

```

## Render human readable limit to one file and hide header

```
> ./bin/cli.js -b examples render example.njk -h --limit-to '{"type": "database"}' --hide-headers # renderFileContent
# Template file templates/context.njk
# Mapping file mappings/example.njk

{"name":"Database"}

```

## Show help

```
> ./bin/cli.js # showHelp
cli.js <command>

Commands:
  cli.js context [context-selector]           Output the full context
  cli.js render <mapping> [context-selector]  Output the rendered template

Options:
      --help           Show help  [boolean]
      --version        Show version number  [boolean]
  -b, --base-dir       path where to find the config  [string] [default: "."]
      --context-dir    directory name of the context folder  [string] [default: "context"]
      --mappings-dir   directory where to search for mappings  [string] [default: "mappings"]
      --templates-dir  directory where to find the templates  [string] [default: "templates"]

Not enough non-option arguments: got 0, need at least 1
```
