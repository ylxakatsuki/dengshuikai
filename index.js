const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter,TeaInvitation } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: { count: await Counter.count() ,name: "yan"},
  });
});

app.get("/api/invitation", async (req, res) => {
  const result = await TeaInvitation.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
  res.send({
    code: 0,
    data: result,
  });
});
// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});
app.get("/api/product", async (req, res) => {
  res.send({
    code: 0,
    data: {
      pinjian: {
        "category": "品鉴装",
        "spec": "2泡",
        "products": [
          {
            "name": "花香肉桂",
            "type": "1",
            "price": 68.00
          },
          {
            "name": "果香肉桂",
            "type": "1",
            "price": 68.00
          },
          {
            "name": "燕子窠肉桂",
            "type": "1",
            "price": 88.00
          },
          {
            "name": "虎啸岩肉桂",
            "type": "1",
            "price": 108.00
          },
          {
            "name": "马头岩肉桂",
            "type": "1",
            "price": 340.00
          },
          {
            "name": "竹窠肉桂",
            "type": "2",
            "price": 500.00
          },
          {
            "name": "九龙窠肉桂",
            "type": "2",
            "price": 560.00
          },
          {
            "name": "牛栏坑肉桂",
            "type": "2",
            "price": 2080.00
          },
          {
            "name": "壹品五读",
            "type": "2",
            "price": 2280.00
          },
          {
            "name": "正岩水仙",
            "type": "1",
            "price": 118.00
          },
          {
            "name": "慧苑坑老枞",
            "type": "2",
            "price": 540.00
          },
          {
            "name": "壹品幽兰",
            "type": "2",
            "price": 600.00
          },
          {
            "name": "牛栏坑水仙",
            "type": "2",
            "price": 800.00
          },
          {
            "name": "大红袍（瑞香）305",
            "type": "1",
            "price": 68.00
          },
          {
            "name": "大红袍（黄观音）105",
            "type": "1",
            "price": 68.00
          },
          {
            "name": "大红袍（金牡丹）220",
            "type": "1",
            "price": 68.00
          }
        ]
      },
    lipin:{
      "category": "礼品装",
      "spec": "2泡",
      "products": [
        {
          "name": "燕子窠肉桂",
          "type": "1",
          "price": 298.00
        },
        {
          "name": "虎啸岩肉桂",
          "type": "1",
          "price": 688.00
        },
        {
          "name": "正岩水仙",
          "type": "1",
          "price": 398.00
        },
        {
          "name": "正岩肉桂",
          "type": "1",
          "price": 258.00
        },
        {
          "name": "纯料马肉桂",
          "type": "1",
          "price": 1080.00
        },
        {
          "name": "竹窠肉桂",
          "type": "1",
          "price": 1580.00
        },
        {
          "name": "慧苑坑老枞",
          "type": "1",
          "price": 1680.00
        },
        {
          "name": "正岩大红袍",
          "type": "1",
          "price": 258.00
        }
      ]
    }
    }
  });
});
app.post("/api/invitation", async (req, res) => {
  const { name, contactInfo, remark } = req.body;
  await TeaInvitation.create({
    name,
    contactInfo,
    remark,
  });
  res.send({
    code: 0,
    data: await TeaInvitation.count(),
  });
});
// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
