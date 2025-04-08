// hooks/useWalletAuth.ts
import {
  useAccount,
  useConnect,
  useSignMessage,
  useDisconnect,
  useConnections,
} from "wagmi";
import { recoverMessageAddress } from "viem";
import { useEffect, useState } from "react";

export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const connections = useConnections();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Wait for wagmi to hydrate and connector to be defined
  const connector = connectors.find((c) => c.id === "metaMaskSDK");

  useEffect(() => {
    if (isConnected && address) {
      const token = localStorage.getItem("auth_token");
      if (token) {
        verifyToken(token).then((valid) => {
          setIsAuthenticated(valid);
          if (!valid) authenticate();
        });
      } else {
        authenticate();
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [isConnected, address, connections]);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Token verification response:", res);
      return res.ok;
    } catch {
      return false;
    }
  };

  const authenticate = async () => {
    if (!address || isAuthenticating) return;
    setIsAuthenticating(true);

    try {
      const nonceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/nonce?address=${address}`
      );
      const { nonce } = await nonceRes.json();
      const message = `Sign this message to authenticate: ${nonce}`;
      const signature = await signMessageAsync({ message });

      const recovered = await recoverMessageAddress({ message, signature });
      if (recovered.toLowerCase() !== address.toLowerCase()) {
        throw new Error("Signature verification failed");
      }

      const loginRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, signature, message }),
        }
      );

      const data = await loginRes.json();
      if (!loginRes.ok)
        throw new Error(data.message || "Authentication failed");

      localStorage.setItem("auth_token", data.accessToken);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    address,
    isConnected,
    isAuthenticated,
    isAuthenticating,
    connect: () => connector && connect({ connector }),
    authenticate,
    disconnect,
  };
}
