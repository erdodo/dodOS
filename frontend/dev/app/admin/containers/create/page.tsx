import { useState, FC } from 'react';
import { createContainer } from '../../../../utils/api';
import { useRouter } from 'next/router';

const CreateContainerPage: FC = () => {
    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [volumes, setVolumes] = useState<string>('');
    const [user, setUser] = useState<string>('');
    const [network, setNetwork] = useState<string>('');
    const [env, setEnv] = useState<string>('');
    const [ports, setPorts] = useState<string>('');
    const [command, setCommand] = useState<string>('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data = {
            name,
            image,
            volumes: volumes.split(','),
            user,
            network,
            env: env.split(','),
            ports: ports.split(',').map(p => ({ [p]: p })),
            command,
        };
        try {
            await createContainer(data);
            router.push('/containers');
        } catch (error) {
            console.error('Failed to create container', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Docker Container</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Image</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Volumes (comma-separated)</label>
                    <input type="text" value={volumes} onChange={(e) => setVolumes(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">User</label>
                    <input type="text" value={user} onChange={(e) => setUser(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Network</label>
                    <input type="text" value={network} onChange={(e) => setNetwork(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Environment Variables (comma-separated)</label>
                    <input type="text" value={env} onChange={(e) => setEnv(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Ports (comma-separated)</label>
                    <input type="text" value={ports} onChange={(e) => setPorts(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Command</label>
                    <input type="text" value={command} onChange={(e) => setCommand(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Container</button>
            </form>
        </div>
    );
};

export default CreateContainerPage;
