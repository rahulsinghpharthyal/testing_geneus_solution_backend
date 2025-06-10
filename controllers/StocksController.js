import yahooFinance from "yahoo-finance2";
import Stock from "../models/Stocks.js";
import { stockList } from "../utilities/parseCSV.js";


const getStocksName = async (req, res) => {
  try {
    // console.log(stockList);
    return res.status(200).json(stockList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stock symbols" });
  }
};

const getStockCurrentPrice = async (req, res) => {
  try {
    const stockName = req.query.name.trim();
    if (!stockName) {
      return res.status(400).json({ error: "Stock name is required" });
    }

    const quote = await yahooFinance.quote(`${stockName.toUpperCase()}.NS`);

    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ error: "Stock data not found" });
    }
    // console.log("this is quote", quote);

    return res.status(200).json({ data: quote });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return res.status(500).json({ error: "Failed to fetch stock price" });
  }
};

const addNewStock = async (req, res) => {
  try {
    const {
      name,
      shares,
      buyPrice,
      currentPrice,
      profit,
      profitPercent,
      purchaseDate,
    } = req.body;
    if (!name && !shares && !buyPrice && !purchaseDate)
      return res
        .stauts(400)
        .json({ success: false, message: "Please Proivide some detils" });

    const newStock = new Stock({
      userId: req.user.userId,
      stockName: name,
      purchasedShares: shares,
      buyPrice: buyPrice,
      currentPrice: currentPrice,
      profit: profit,
      profitPercentage: profitPercent,
      purchaseDate: purchaseDate,
    });
    await newStock.save();
    return res.status(201).json({success: true, message: 'New Stock created'})
  } catch (error) {
    console.log("terror on adding stock", error);
    res.status(500).json({ error: "Failed to add the stock" });
  }
};


const updateStock = async (req, res) => {
  try{
     const {
      name,
      shares,
      buyPrice,
      currentPrice,
      profit,
      profitPercent,
      purchaseDate,
    } = req.body;
    const {id} = req.params;
     const updatedStock = await Stock.findOneAndUpdate(
      { _id: id },
      {
        name,
        shares,
        buyPrice,
        currentPrice,
        profit,
        profitPercentage: profitPercent,
        purchaseDate,
      },
      {
        new: true, 
        runValidators: true, 
      }
    );
  if (!updatedStock) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }

    return res.status(200).json({ success: true, data: updatedStock });

  }catch(error){
    console.log('Error on Updating the existing Stock', error)
    return res.status(500).json({success: false, message: error})
  }
}


const getUserStocks = async(req, res)=>{
  try{
    const {userId} = req.params;
    if(userId !== req.user.userId)
      return res.status(400).json({success: false, message: "Please access your data"});
    const stocks = await Stock.find({userId: userId});
    if(!stocks) return res.status(400).json({success: false, message: 'No Stock found Add stocks'});
    return res.status(200).json({success: true, stocks})
  }catch(error){
    console.log('Error on getting Users Stocks', error);
    return res.status(500).json({success: false, message: error})
  }
}
export { getStocksName, addNewStock, getStockCurrentPrice, getUserStocks, updateStock };
