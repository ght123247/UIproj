/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // 主题色配置 - 直接覆盖 Tailwind 默认颜色，全局生效
        // 方案1: 当前使用
        // 霓虹蓝 + 霓虹紫 - 适合未来科技感
/*         orange: {
          400: "#ff6ec7",  // 霓虹紫 - 边框和浅色使用
          500: "#ff00ff",  // 霓虹紫 - 主色 (isOrange=true 时使用)
          600: "#cc00cc",  // hover 状态
          900: "#660066",  // 深色文字
        },
        blue: {
          400: "#00d9ff",  // 霓虹蓝 - 边框和浅色使用
          500: "#00b8ff",  // 霓虹蓝 - 主色 (isOrange=false 时使用)
          600: "#0099cc",  // hover 状态
          900: "#003d4d",  // 深色文字
        }, */
        
        // 方案2: 工业机械风格 (注释备用)
        // 金属蓝 + 警告橙 - 适合工业监控
/*          orange: {
           400: "#ff8c42",  // 警告橙 - 边框和浅色使用
           500: "#ff6b00",  // 警告橙 - 主色
           600: "#cc5500",  // hover 状态
           900: "#663300",  // 深色文字
         },
         blue: {
           400: "#5dade2",  // 金属蓝 - 边框和浅色使用
           500: "#3498db",  // 金属蓝 - 主色
           600: "#2874a6",  // hover 状态
           900: "#1a4d73",  // 深色文字
        },
         */
        // 方案3: 未来科技风格 (注释备用)
        // 电光蓝 + 能量绿 - 适合高科技感
   /*       orange: {
           400: "#39ff14",  // 能量绿 - 边框和浅色使用
           500: "#00ff00",  // 能量绿 - 主色
           600: "#00cc00",  // hover 状态
           900: "#006600",  // 深色文字
        },
        blue: {
           400: "#00ffff",  // 电光蓝 - 边框和浅色使用
           500: "#00d4ff",  // 电光蓝 - 主色
           600: "#00a8cc",  // hover 状态
           900: "#004d5c",  // 深色文字
        }, */
        
        // 方案4: 暗黑工业风格 (注释备用)
        // 钢铁灰蓝 + 警示黄 - 适合重工业感
 /*         orange: {
          400: "#ffd700",  // 警示黄 - 边框和浅色使用
          500: "#ffb800",  // 警示黄 - 主色
          600: "#cc9300",  // hover 状态
          900: "#664900",  // 深色文字
        },
        blue: {
          400: "#6c7a89",  // 钢铁灰蓝 - 边框和浅色使用
          500: "#566573",  // 钢铁灰蓝 - 主色
          600: "#455360",  // hover 状态
          900: "#2c3e50",  // 深色文字
        }, */
        
        // 方案5: 原始配色 (注释备用)
        // 粉红 + 青绿 - 之前使用的配色
         orange: {
          400: "#e85d8a",  // 粉红 - 边框和浅色使用
          500: "#e04671",  // 粉红 - 主色
          600: "#c7365d",  // hover 状态
          900: "#6b1a2e",  // 深色文字
        },
        blue: {
          400: "#8ee9d4",  // 青绿 - 边框和浅色使用
          500: "#46e0c7",  // 青绿 - 主色
          600: "#3ab8a5",  // hover 状态
          900: "#1d5a4e",  // 深色文字
        },
      },
    },
  },
  plugins: [],
}

