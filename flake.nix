{
  description = "Cosmos healthcare monorepo - Cub Care and GP Consults";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/a91adc29aa45687022523be3ead6a0a833c287f8";
  };

  outputs = { self, nixpkgs, ... }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
        in
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              bun
              git
              nodejs_23
              ripgrep
            ] ++ lib.optionals stdenv.isLinux [
              glibcLocales
            ];

            shellHook = ''
              REPO=$(git rev-parse --show-toplevel)
              export PATH="$PATH:$REPO/cli/bin"

              export NIX_DEVELOP_READY=1
            '';
          };
        }
      );

      formatter = forAllSystems (system:
        (import nixpkgs { inherit system; }).nixpkgs-fmt
      );
    };
}
