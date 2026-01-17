import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createPublicClient, DecodeLogTopicsMismatch, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
// Import file JSON artifact secara utuh
import * as LockArtifact from './Lock.json';
// import { from } from "rxjs";

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });

    // Address (Day 3 deployment)
    this.contractAddress = '0xa7a117461221eab04e101387c7329ef0ca4a6215';
  }

  // 🔹 Read latest value
  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        // PERBAIKAN 1: Ambil property .abi dari dalam Artifact
        abi: LockArtifact.abi,
        // PERBAIKAN 2: Ganti 'getValue' jadi 'value'
        functionName: 'value',
      });

      return {
        value: value.toString(),
      };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // 🔹 Read ValueUpdated events
  async getValueUpdatedEvents(fromBlock: number, toBlock: number) {
    try {
      // Sebelum eksekusi logic, pastikan (toBlock - frontBlock) < 2048)
      // Jika lebih besar, kembalikan error ke client

      const events = await this.client.getLogs({
        address: this.contractAddress,
        // Bagian event ini manual definition (inline ABI), jadi aman-aman saja.
        // Tapi pastikan type datanya sesuai (uint256 sudah benar).
        event: {
          type: 'event',
          name: 'ValueUpdated',
          inputs: [
            {
              name: 'newValue',
              type: 'uint256',
              indexed: false,
            },
          ],
        },
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });
      // fromBlock: 50616000n,
      // toBlock: 50617000n,
  
      // Mapping hasil event
      return events.map((event) => ({
        blockNumber: event.blockNumber?.toString(),
        // Pastikan args.newValue sesuai dengan nama di input event di atas
        value: event.args.newValue.toString(),
        txHash: event.transactionHash,
      }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // 🔹 Centralized RPC Error Handler
  private handleRpcError(error: any): never {
    // const message = error?.message?.toLowerCase() || "";
    const message = error instanceof Error ? error.message : String(error);

    console.log({error: message});
    
    if (message.includes('timeout')) {
      throw new ServiceUnavailableException(
        'RPC timeout. Silakan coba beberapa saat lagi.',
      );
    }

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed')
    ) {
      throw new ServiceUnavailableException(
        'Tidak dapat terhubung ke blockchain RPC.',
      );
    }

    throw new InternalServerErrorException(
      'Terjadi kesalahan saat membaca data blockchain.',
    );
  }
}
