if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.warn("我们的项目使用的包管理器是pnpm，如果你使用其他包管理，请切换至pnpm包管理器");
  process.exit();
}