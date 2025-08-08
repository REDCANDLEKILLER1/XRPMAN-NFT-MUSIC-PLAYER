export const config = { runtime: 'nodejs20.x' };
export default (req, res) => {
  res.status(200).json({
    ok: true,
    node: process.version,
    type: typeof require === 'function' ? 'cjs' : 'esm'
  });
};
