using System.Net;
using System.Net.Sockets;
using System.Text;

int chatPort = 0;
bool isCreator = false;
bool accessGranted = false;
using var udpSender = new UdpClient(AddressFamily.InterNetwork);
IPAddress multicastIP = IPAddress.Parse("235.5.5.11");
Console.Write("Enter your name: ");
string? user = Console.ReadLine();
Console.WriteLine("Type '/join --port' or '/create --port'");

Task.Run(ListenForMessagesAsync);
await SendMessagesAsync();

async Task SendMessagesAsync()
{
    while (true)
    {
        byte[] msgData;
        string? input = Console.ReadLine();
        if (input.StartsWith("/") && isCreator)
        {
            switch (input)
            {
                case "/accept":
                    msgData = Encoding.UTF8.GetBytes(input);
                    await udpSender.SendAsync(msgData, new IPEndPoint(multicastIP, chatPort));
                    continue;
                case "/deny":
                    msgData = Encoding.UTF8.GetBytes(input);
                    await udpSender.SendAsync(msgData, new IPEndPoint(multicastIP, chatPort));
                    continue;
                default:
                    Console.WriteLine("Error!");
                    continue;
            }
        }
        string msg = $"{user}: {input}";
        msgData = Encoding.UTF8.GetBytes(msg);
        Console.SetCursorPosition(0, Console.CursorTop - 1);
        await udpSender.SendAsync(msgData, new IPEndPoint(multicastIP, chatPort));
    }
}

async Task ListenForMessagesAsync()
{
    using var udpReceiver = new UdpClient();
    udpReceiver.ExclusiveAddressUse = false;
    udpReceiver.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
    udpReceiver.Client.Bind(new IPEndPoint(IPAddress.Any, chatPort));

    byte[] groupAddresses = new byte[12];
    Buffer.BlockCopy(multicastIP.GetAddressBytes(), 0, groupAddresses, 0, 4);
    Buffer.BlockCopy(IPAddress.Any.GetAddressBytes(), 0, groupAddresses, 4, 4);
    Buffer.BlockCopy(IPAddress.Any.GetAddressBytes(), 0, groupAddresses, 8, 4);
    udpReceiver.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.AddMembership, groupAddresses);

    while (true)
    {
        byte[] receivedData;
        var result = await udpReceiver.ReceiveAsync();
        string receivedText = Encoding.UTF8.GetString(result.Buffer);

        if (!accessGranted && receivedText.Equals("/accept"))
        {
            Console.WriteLine("Done!");
            receivedData = Encoding.UTF8.GetBytes($"{user} joined the room");
            await udpSender.SendAsync(receivedData, new IPEndPoint(multicastIP, chatPort));
            accessGranted = true;
            return;
        }
        else if (!accessGranted && receivedText.Equals("/deny"))
        {
            Console.WriteLine("Error!");
            Environment.Exit(1);
            return;
        }
        else if (receivedText.StartsWith('*') && !isCreator || !accessGranted || receivedText.StartsWith('/'))
        {
            continue;
        }
        Console.WriteLine(receivedText);
    }
}

while (chatPort == 0)
{
    string? input = Console.ReadLine();
    if (input.StartsWith("/"))
    {
        try
        {
            var parts = input.Split(' ');
            switch (parts[0])
            {
                case "/create":
                    chatPort = Int32.Parse(parts[1]);
                    if (System.Net.NetworkInformation.IPGlobalProperties.GetIPGlobalProperties().GetActiveUdpListeners().Any(p => p.Port == chatPort))
                    {
                        Console.WriteLine("Error!");
                        chatPort = 0;
                        continue;
                    }
                    isCreator = true;
                    accessGranted = true;
                    Console.WriteLine("Done!");
                    break;
                case "/join":
                    chatPort = Int32.Parse(parts[1]);
                    if (!System.Net.NetworkInformation.IPGlobalProperties.GetIPGlobalProperties().GetActiveUdpListeners().Any(p => p.Port == chatPort))
                    {
                        Console.WriteLine("Error!");
                        chatPort = 0;
                        continue;
                    }
                    byte[] joinRequest = Encoding.UTF8.GetBytes($"{user} wants to join your room. /accept or /deny");
                    await udpSender.SendAsync(joinRequest, new IPEndPoint(multicastIP, chatPort));
                    await Task.Run(ListenForMessagesAsync);
                    break;
                default:
                    Console.WriteLine("Error!");
                    continue;
            }
        }
        catch (Exception)
        {
            Console.WriteLine("Error!");
        }
    }
    else
    {
        Console.WriteLine("Error!");
        continue;
    }
}
