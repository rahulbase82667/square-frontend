// import axios from 'axios';


// // const SQUARE_CLIENT_ID = 'YOUR_SQUARE_CLIENT_ID';
// // const SQUARE_CLIENT_SECRET = 'YOUR_SQUARE_CLIENT_SECRET';
// // const SQUARE_REDIRECT_URI = `${window.location.origin}/oauth-callback`;

// export const getSquareAccessToken = async (authCode: string) => {
//     try {
//         const response = await axios.post('https://connect.squareup.com/oauth2/token', {
//             client_id: "sq0idp-k179M9PgyycfIe79od8WTQ",
//             client_secret: "EAAAl7wuu6ayAloKJ0uxnDTt6QX2-Sa8W7tmGSuMcADB09D4CNQgyrgBa19QG5hC",
//             code: authCode,
//             grant_type: 'authorization_code',
//             redirect_uri: "http://localhost:8080/oauth-callback"
//             //    redirect_uri: `${window.location.origin}/oauth-callback`
//         });

//         return response.data.access_token;
//     } catch (error) {
//         console.error('Error fetching Square access token:', error);
//         throw new Error('Failed to connect Square account.');
//     }
// };

// export const connectSquareDirectly = async () => {
//     try {
//         const response = await axios.get('/api/square/connect');
//         return response.data;
//     } catch (error) {
//         console.error('Error connecting Square directly:', error);
//         throw new Error('Failed to connect Square account.');
//     }
// };



export const connectSquareDirectly = async () => {
    const response = await fetch('https://connect.squareup.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: 'sq0idp-k179M9PgyycfIe79od8WTQ',
        client_secret: 'EAAAl7wuu6ayAloKJ0uxnDTt6QX2-Sa8W7tmGSuMcADB09D4CNQgyrgBa19QG5hC',
        code: 'AUTHORIZATION_CODE',
        grant_type: 'authorization_code'
      })
    });
  
    if (!response.ok) throw new Error('Failed to connect Square');
    
    return response.json(); // returns { accessToken }
  };
  


// export const connectSquareDirectly = async () => {
//     return new Promise((resolve, reject) => {
//       const clientId = "sq0idp-k179M9PgyycfIe79od8WTQ";
//       const redirectUri = "http://localhost:8080/oauth-callback";
//       const authUrl = `https://connect.squareup.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=ITEMS_READ ITEMS_WRITE INVENTORY_READ INVENTORY_WRITE&redirect_uri=${redirectUri}`;
  
//       const popup = window.open(authUrl, '_blank', 'width=500,height=600');
  
//       const handleMessage = async (event: MessageEvent) => {
//         if (event.origin !== window.location.origin) return;
  
//         const { code } = event.data;
//         if (code) {
//           try {
//             const tokenResponse = await fetch('https://connect.squareup.com/oauth2/token', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Basic ${btoa(`${clientId}:${"EAAAl7wuu6ayAloKJ0uxnDTt6QX2-Sa8W7tmGSuMcADB09D4CNQgyrgBa19QG5hC"}`)}`,
//               },
//               body: JSON.stringify({
//                 client_id: clientId,
//                 client_secret: "EAAAl7wuu6ayAloKJ0uxnDTt6QX2-Sa8W7tmGSuMcADB09D4CNQgyrgBa19QG5hC",
//                 code,
//                 grant_type: 'authorization_code',
//               }),
//             });
  
//             if (!tokenResponse.ok) throw new Error('Failed to exchange code for token');
  
//             const tokenData = await tokenResponse.json();
//             resolve(tokenData);
//           } catch (error) {
//             reject(error);
//           }
//         }
//       };
  
//       window.addEventListener('message', handleMessage);
  
//       // Clean up event listener if popup is closed
//       const interval = setInterval(() => {
//         if (popup?.closed) {
//           clearInterval(interval);
//           window.removeEventListener('message', handleMessage);
//           reject(new Error('Popup closed by user'));
//         }
//       }, 500);
//     });
//   };
  