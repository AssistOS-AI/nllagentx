export const helpText = `nllAgent — executable semantic-program workbench

Usage: nllAgent <command> [subcommand] [options]

Workspace:
  agent create|show|check|catalog --agent <name>|--agent-dir <path>
  task create|show|sources|clean-runs --agent ... [--task <id>|--task-dir <path>]
  code architect|intent|ontology|longtext|circuit|sdk|review --agent ... [--task ...]

Execution:
  analyze|run|generate|plan|query --agent ... --task ...
  run|analyze|generate ... [--format response|json]       response is tagged human-readable Markdown CNL (default)
  analyze ... --author-adaptive [--authoring-cycles 1..10] [--assurance none|abstract|symbolic|all]
              [--adaptive-allow-unknown]
  test framework|packs|agent|task|all [--level fast|standard|exhaustive]
  evaluate --suite <name-or-suite.mjs> [--invoke-agent] [--model <id>]

Inspection:
  context build|show        files index          catalog sdk|ontology|circuit
  sdk check|usage [--surface core|ontology|longtext|circuit|cnl|intent|agent|evaluation|analysis]
  profile resolve           source ingest|outline|show|search|span|verify-anchors
  ontology check|build|show|affected             longtext check|execute|query|coverage
  intent check|infer-signals|explain              circuit check|plan|run|abstract|symbolic
  trace slice|explain|compare                     cnl render|parse|roundtrip
  review bundle

Global path options:
  --project-root <path>  --agent <name-or-path>  --agent-dir <path>
  --task <id-or-path>    --task-dir <path>       --profile <id>

Semantic artifacts are executable .mjs modules. JSON/TypeScript semantic artifacts are not accepted.
`;
