import React from "react";
import { Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";



const WhyExhibt = () => {
  return (
    <>
      <main className="main specl_pro">
        <div className="py-120 bg-metavr">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="property-single-content property-single-contentt2">
                  <h2 className="whyexTitle brline">
                    Why Exhibit
                  </h2>
                  <div className="property-single-description">

                    <p>
                      For builders, AirPropX offers a cost-effective way to showcase projects to a global audience, generate quality leads, gain valuable customer insights through analytics, and establish connections with potential buyers and industry professionals, all without the logistical challenges of physical events.
                    </p>
                  </div>
                  <div className="text-center tagline_txt">

                    <Carousel>
                      <Carousel.Item>
                        <p className="slid_clr_meta1">"AirPropX: Redefining Real Estate Expos in the Metaverse."</p>
                      </Carousel.Item>
                      <Carousel.Item>
                        <p className="slid_clr_meta2">"Step into the Future of Real Estate Showcases with AirPropX."</p>
                      </Carousel.Item>
                    </Carousel>


                  </div>
                </div>




              </div>
            </div>
            <div className="col-md-12 text-center">
              <h2 className="whyexTitle">
                Benefits for Builders in AirPropX Virtual Expo
              </h2>
            </div>
            <div className="row flex-rev">
              <div className="col-lg-6 col-md-12">
                <div className="overFsrol">
                  <div className="whySubTitle">
                    <h3 className=""><span>»</span>Expanded Reach</h3>
                    <h5>Connect with a global audience of property buyers, transcending geographical limitations to maximize exposure.</h5>
                  </div>
                  <div className="whySubTitle">
                    <h3 className=""><span>»</span>Cost-Effective Marketing</h3>
                    <h5>Connect with a global audience of property buyers, transcending geographical limitations to maximize exposure.</h5>
                  </div>
                  <div className="whySubTitle">
                    <h3 className=""><span>»</span>Immersive Showcasing</h3>
                    <h5>Offer advanced 3D metaverse walkthroughs and immersive experiences, providing buyers with a realistic feel of your properties anytime, anywhere.</h5>
                  </div>
                  <div className="whySubTitle">
                    <h3 className=""><span>»</span>Data-Driven Insights</h3>
                    <h5>Leverage valuable analytics on visitor interests, daily visitor counts, executive performance, time spent at stalls, and brochure downloads to refine your marketing strategies effectively.</h5>
                  </div>
                  <div className="whySubTitle">
                    <h3 className=""><span>»</span>Eco-Friendly Solution</h3>
                    <h5>Participate in a sustainable, environmentally conscious alternative to traditional expos, reducing your carbon footprint. strategies effectively.</h5>
                  </div>
                  <div className="whySubTitle">
                    <h3 className=""><span>»</span>Flexibility to Innovate</h3>
                    <h5>Design your virtual stall with banners, videos, and interactive elements, creating a unique and impactful brand presentation..</h5>
                  </div>
                  <div className="whySubTitle">
                    <h3 className=""><span>»</span>Multiple Lead Opportunities</h3>
                    <h5>Generate leads not only from your stall but also from shared visitor information, broadening your buyer base and cross-selling opportunities.</h5>
                  </div>
                  <div className="whySubTitle">
                    <h3 className=""><span>»</span>Brand Positioning</h3>
                    <h5>Leverage valuable analytics on visitor interests, daily visitor counts, executive performance, time spent at stalls, and brochure downloads to refine your marketing strategies effectively.</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="spcil_ot_meta">
                  {/* <Image src={"/assets/img/airpropx-la1.png"} width={600}
                        height={300} /> */}
                  <img src="assets/images/whyEx.jpg" alt="image" width={600}
                    height={300} />
                  <div className="imageLineC"></div>
                  <Link to={`https://builder.admin.terraterri.com/`} target="_blank">   <button>Book Your Stall</button></Link>


                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </>
  )
}
export default WhyExhibt