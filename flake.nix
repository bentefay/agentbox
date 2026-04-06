{
  description = "Agentbox - Secure, isolated development environments for AI coding agents";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };

          # Safe-chain binary (pre-built from Aikido releases)
          safe-chain-version = "1.4.7";

          safe-chain-platformMap = {
            "x86_64-linux" = "linuxstatic-x64";
            "aarch64-linux" = "linuxstatic-arm64";
            "x86_64-darwin" = "macos-x64";
            "aarch64-darwin" = "macos-arm64";
          };

          safe-chain-platform = safe-chain-platformMap.${system};

          safe-chain-hashes = {
            "x86_64-linux" = "14hgabcwyfg87cch71k8sdn071x532ahn3w5mfcqnqjy9h8qc014";
            "aarch64-linux" = "1wg7yhzqdhs36dzcs3a5147vym53wg99hc7p9h58sdm9s0f920m0";
            "x86_64-darwin" = "0kc2myvqhk5xc1a3gixfdln1aj9zyrfjxmvq8sn9fm4j61ip2mfp";
            "aarch64-darwin" = "093qs22isx7kizfhb9p4im6gqx1yffvh6a2yxjvj7vdbf1gqwd5r";
          };

          safe-chain = pkgs.stdenv.mkDerivation {
            pname = "safe-chain";
            version = safe-chain-version;

            src = pkgs.fetchurl {
              url = "https://github.com/AikidoSec/safe-chain/releases/download/${safe-chain-version}/safe-chain-${safe-chain-platform}";
              sha256 = safe-chain-hashes.${system};
            };

            unpackPhase = ":";

            # SEA binaries have data appended that strip removes
            dontStrip = true;

            installPhase = ''
              install -m755 -D $src $out/bin/safe-chain
            '';

            meta = with pkgs.lib; {
              homepage = "https://github.com/AikidoSec/safe-chain";
              license = licenses.agpl3Plus;
              description = "Block malicious npm/pip packages";
              platforms = builtins.attrNames safe-chain-hashes;
            };
          };

          # Safe-chain wrapped bun with bunx blocked
          bun-safe = pkgs.writeShellScriptBin "bun" ''
            case "$1" in
              x)
                echo "bun x: blocked by safe-chain policy. One-shot execution is disabled." >&2
                exit 1
                ;;
            esac
            PATH="${pkgs.bun}/bin:$PATH" exec ${safe-chain}/bin/safe-chain bun "$@"
          '';

          # Node with friction warning (hidden from general PATH, available for tooling)
          node-safe = pkgs.writeShellScriptBin "node" ''
            echo "node: prefer bun for script execution. node is available for tooling that requires it." >&2
            exec ${pkgs.nodejs}/bin/node "$@"
          '';

          # Blocker script generators
          mkBlocker =
            name: alt:
            pkgs.writeShellScriptBin name ''
              echo "${name}: blocked by safe-chain policy. Use ${alt} instead." >&2
              exit 1
            '';

          mkExecutorBlocker =
            name:
            pkgs.writeShellScriptBin name ''
              echo "${name}: blocked by safe-chain policy. One-shot execution is disabled." >&2
              exit 1
            '';

          blockers = [
            (mkBlocker "npm" "bun")
            (mkBlocker "yarn" "bun")
            (mkBlocker "pnpm" "bun")
            (mkBlocker "deno" "bun")
            (mkExecutorBlocker "npx")
            (mkExecutorBlocker "pnpx")
            (mkExecutorBlocker "bunx")
          ];

          # Safe-chain with setup commands blocked (flake handles this)
          safe-chain-wrapped = pkgs.writeShellScriptBin "safe-chain" ''
            case "$1" in
              setup|teardown|setup-ci|help|"")
                echo "safe-chain $1: blocked. The flake handles safe-chain integration." >&2
                exit 1
                ;;
              --version|-v)
                exec ${safe-chain}/bin/safe-chain "$@"
                ;;
              *)
                echo "safe-chain $1: blocked. The flake handles safe-chain integration." >&2
                exit 1
                ;;
            esac
          '';

        in
        {
          default = pkgs.mkShell {
            buildInputs = [
              safe-chain-wrapped
              bun-safe
              node-safe
              pkgs.git
              pkgs.ripgrep
            ] ++ blockers
              ++ pkgs.lib.optionals pkgs.stdenv.isLinux [
              pkgs.glibcLocales
            ];

            shellHook = ''
              REPO=$(git rev-parse --show-toplevel)
              export PATH="$REPO/bin:$PATH"

              export NIX_DEVELOP_READY=1

              # Background check for safe-chain updates (minor/major only)
              (
                latest=$(${pkgs.curl}/bin/curl -sfL -o /dev/null -w '%{url_effective}' \
                  "https://github.com/AikidoSec/safe-chain/releases/latest" \
                  | grep -oE '[0-9]+\.[0-9]+\.[0-9]+$') || exit 0
                current="${safe-chain-version}"
                current_major=''${current%%.*}
                current_minor=''${current#*.}; current_minor=''${current_minor%%.*}
                latest_major=''${latest%%.*}
                latest_minor=''${latest#*.}; latest_minor=''${latest_minor%%.*}
                if [ "$current_major" != "$latest_major" ] || [ "$current_minor" != "$latest_minor" ]; then
                  echo "[safe-chain] update available: $current -> $latest (update flake.nix)" >&2
                fi
              ) &
            '';
          };
        }
      );

      formatter = forAllSystems (system: (import nixpkgs { inherit system; }).nixfmt);
    };
}
