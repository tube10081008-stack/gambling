import https from 'https';

const url = 'https://slotbuff3.com/board/fg_ppg';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        // Simple regex to find img srcs
        const regex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = regex.exec(data)) !== null) {
            console.log(match[1]);
        }
    });
}).on('error', (err) => {
    console.error(err.message);
});
