export default async function handler(req, res) {
  try {
    console.log('--- RUNNING CONNECTION TEST ---');
    const response = await fetch('https://xumm.app/api/v1/platform/ping');
    
    if (!response.ok) {
      throw new Error(`The API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('--- CONNECTION TEST SUCCESSFUL ---', data);
    res.status(200).json({ success: true, data: data });

  } catch (error) {
    console.error('--- CONNECTION TEST FAILED ---', error);
    res.status(500).json({ success: false, message: error.message });
  }
}