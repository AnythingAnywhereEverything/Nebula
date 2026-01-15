import React from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import PL from "@styles/ui/productWindow.module.scss"
import { Link } from "react-router-dom";


export interface ProductItem {
    itemid: string;
    itemtag?: string;
    itemtagcolor?: string;
    itemtitle: string;
    itemimageurl: string;
    itemprice_usd: number;
    itemrating?: number;
    productLocation: string;
    itemSold: string;
}

type BaseProductWindowProps = {
  items: ProductItem[];

  itemtag?: string;
};

type FullInfo = BaseProductWindowProps & {
  showInfo?: true;
};

type OnlyPrice = BaseProductWindowProps & {
  showInfo?: false;
};

export type ProductWindowProps = FullInfo | OnlyPrice;

export const ProductWindow: React.FC<ProductWindowProps> = (props) => {
  
  if ("showInfo" in props) {
    // CHANGE LATER
    return (
    <>
        {props.items.map((item) => (
            <li key={item.itemid} >
              
                <div style={{display: "contents"}}>
                  <div className={PL.product}>
                    <a href="#" className={PL.productLink}>
                      <section className={PL.productContainer}>
                        <div className={PL.productImage}>

                          <img src="https://placehold.co/400" alt=""/>
                            
                            {item.itemtag && item.itemtagcolor && (
                              <div
                              className={PL.sticker}
                              style={{ backgroundColor: item.itemtagcolor }}
                              >
                                <span>{item.itemtag}</span>
                              </div>
                            )}

                        </div>
                          
                        <div className={PL.productDetail}>
                          <div className={PL.itemTitle}>
                            <p>{item.itemtitle}</p>
                          </div>

                            <p>${item.itemprice_usd}</p>
                              <p className={PL.location}>
                                <span>location </span>
                                {item.productLocation}
                              </p>
                        </div>
                      </section>
                    </a>
                    
                  </div>
                </div>
            </li>
        ))}
    </>
    )
  }

  return (
  <>
    {props.items.map((item) => (
            <li key={item.itemid} >
            
              <div style={{display: "contents"}}>
                <div className={PL.product}>
      
                  <a href="#" className={PL.productLink}>
                    <section className={PL.productContainer}>
                      <div className={PL.productImage}>
                        <img src="https://placehold.co/400" alt=""/>
      
                          <div className={PL.sitcker}>
                            {/* Add some sitckerhere :D */}
                            <span>Sale</span>
                          </div>
      
                      </div>
                        
                      <div className={PL.productDetail}>
      
                          <p>${item.itemprice_usd}</p>
                            <p className={PL.location}>
                              <span>location </span>
                              {item.productLocation}
                            </p>
                      </div>
      
                    </section>
                  </a>
                  
                </div>
              </div>
          </li>
        ))}
  </>
  );
};