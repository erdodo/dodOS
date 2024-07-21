export interface Container {
  Id(arg0: string, Id: any): void;
  key: string;
    command: string[];
    created: string;
    id: string;
    image: string[];
    labels: Record<string, string>;
    mounts: Array<{
      Destination: string;
      Mode: string;
      Propagation: string;
      RW: boolean;
      Source: string;
      Type: string;
    }>;
    name: string;
    network_settings: {
      Bridge: string;
      EndpointID: string;
      Gateway: string;
      GlobalIPv6Address: string;
      GlobalIPv6PrefixLen: number;
      HairpinMode: boolean;
      IPAddress: string;
      IPPrefixLen: number;
      IPv6Gateway: string;
      LinkLocalIPv6Address: string;
      LinkLocalIPv6PrefixLen: number;
      MacAddress: string;
      Networks: Record<string, {
        Aliases: any;
        DNSNames: any;
        DriverOpts: any;
        EndpointID: string;
        Gateway: string;
        GlobalIPv6Address: string;
        GlobalIPv6PrefixLen: number;
        IPAMConfig: any;
        IPAddress: string;
        IPPrefixLen: number;
        IPv6Gateway: string;
        Links: any;
        MacAddress: string;
        NetworkID: string;
      }>;
      Ports: Record<string, any>;
      SandboxID: string;
      SandboxKey: string;
      SecondaryIPAddresses: any;
      SecondaryIPv6Addresses: any;
    };
    state: {
      Dead: boolean;
      Error: string;
      ExitCode: number;
      FinishedAt: string;
      Health: {
        FailingStreak: number;
        Log: Array<{
          End: string;
          ExitCode: number;
          Output: string;
          Start: string;
        }>;
        Status: string;
      };
      OOMKilled: boolean;
      Paused: boolean;
      Pid: number;
      Restarting: boolean;
      Running: boolean;
      StartedAt: string;
      Status: string;
    };
    status: string;
  }