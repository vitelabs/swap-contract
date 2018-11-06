## Erc2Vite 测试说明

#### 1、启ganache-cli节点

新启一个终端，使用ganache-cli -p 9999, 启动一个测试节点，端口号为9999

#### 2、部署erc2vite.sol合约
使用truffle框架进行合约部署

cd 
编译： truffle compile
部署： truffle migrate
此时得到viteToken合约地址viteTokenAddress和erc2vite合约地址erc2viteAddress

#### 3、运行测试代码
truffle test ./test/testErc2Vite.js

#### 4、运行监控代码
里面的abi和合约地址要根据第2步得到的结果确定

node watch_event.js

#### 5、多次绑定操作
truffle test ./test/testBind.js

在第4步监控界面能够看见多次监听event的结果。