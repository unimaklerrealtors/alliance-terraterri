import { useState, useEffect } from 'react'
import Loader from '../components/Loader';
import { expoAdminClient } from '../utils/httpClient';
import { toastError, toastWarning } from '../utils/toast';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaSearch } from "react-icons/fa";



const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};




const AirPropex = () => {

  const [loading, setLoading] = useState(false);
  const [expos, setExpos] = useState([]);
  const [filteredExpos, setFilteredExpos] = useState([]);
  const [filteredCom, setFilteredCom] = useState([]);
  const [filteredBan, setFilteredBan] = useState([]);
  const [filteredIn, setFilteredIn] = useState([]);
  const [filteredInt, setFilteredInt] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCountryview, setSelectedCountryview] = useState('India');
  const [selectedCountryInt, setselectedCountryInt] = useState('India');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityview, setSelectedCityview] = useState('');
  const [selectedCityInt, setselectedCityInt] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredDates, setFilteredDates] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [showSlots, setShowSlots] = useState(false);
  const [showViews, setShowViews] = useState(false);
  const [showInt, setshowInt] = useState(false);
  const [activeTab, setActiveTab] = useState('Residential');
  const [filint, setfilint] = useState('International');
  const [separteDate, setseparteDate] = useState([]);

  const completedExpo = async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await expoAdminClient.get('NewExpo/get.php?type=future&limit=50&skip=0', config);

      if (res?.data?.status) {
        const exposData = res.data.data;
        setExpos(exposData);

        const filtered = exposData.filter((expo) => expo.expoType === 'Residential');
        setFilteredExpos(filtered);

        const comDate = filtered.reduce((acc, expo) => {
          const month = moment(expo.fromDate).format("MMMM YYYY"); // Extract month and year
          const date = moment(expo.fromDate).format("Do MMM YYYY"); // Extract specific date

          if (!acc[month]) {
            acc[month] = {}; // Initialize month object
          }

          if (!acc[month][date]) {
            acc[month][date] = []; // Initialize date array within the month
          }

          acc[month][date].push(expo);

          return acc;
        }, {});

        console.log('Date-wise grouped data:', comDate);
        const comDateData = Object.entries(comDate).map(([month, dates]) => ({
          month,
          dates: Object.entries(dates).map(([date, events]) => ({
            date,
            events,
          })),
        }));
        setFilteredExpos(comDateData);


        const filteredCom = exposData.filter((expo) => expo.expoType === 'Commercial');
        setFilteredCom(filteredCom);

        const residentialDate = filteredCom.reduce((acc, expo) => {
          const month = moment(expo.fromDate).format("MMMM YYYY"); // Extract month and year
          const date = moment(expo.fromDate).format("Do MMM YYYY"); // Extract specific date

          if (!acc[month]) {
            acc[month] = {}; // Initialize month object
          }

          if (!acc[month][date]) {
            acc[month][date] = []; // Initialize date array within the month
          }

          acc[month][date].push(expo);

          return acc;
        }, {});

        console.log('Date-wise grouped data:', residentialDate);
        const residentialDateData = Object.entries(residentialDate).map(([month, dates]) => ({
          month,
          dates: Object.entries(dates).map(([date, events]) => ({
            date,
            events,
          })),
        }));

        setFilteredCom(residentialDateData);

        const filteredBan = exposData.filter((expo) => expo.expoType === 'Banking');
        setFilteredBan(filteredBan);

        const bankDate = filteredBan.reduce((acc, expo) => {
          const month = moment(expo.fromDate).format("MMMM YYYY"); // Extract month and year
          const date = moment(expo.fromDate).format("Do MMM YYYY"); // Extract specific date

          if (!acc[month]) {
            acc[month] = {}; // Initialize month object
          }

          if (!acc[month][date]) {
            acc[month][date] = []; // Initialize date array within the month
          }

          acc[month][date].push(expo);

          return acc;
        }, {});

        console.log('Date-wise grouped data:', bankDate);
        const bankDateData = Object.entries(bankDate).map(([month, dates]) => ({
          month,
          dates: Object.entries(dates).map(([date, events]) => ({
            date,
            events,
          })),
        }));

        setFilteredBan(bankDateData);



        const filteredIn = exposData.filter((expo) => expo.expoType === 'Interior');
        setFilteredIn(filteredIn);


        const intreDate = filteredIn.reduce((acc, expo) => {
          const month = moment(expo.fromDate).format("MMMM YYYY"); // Extract month and year
          const date = moment(expo.fromDate).format("Do MMM YYYY"); // Extract specific date

          if (!acc[month]) {
            acc[month] = {}; // Initialize month object
          }

          if (!acc[month][date]) {
            acc[month][date] = []; // Initialize date array within the month
          }

          acc[month][date].push(expo);

          return acc;
        }, {});

        console.log('Date-wise grouped data:', intreDate);
        const intreDateData = Object.entries(intreDate).map(([month, dates]) => ({
          month,
          dates: Object.entries(dates).map(([date, events]) => ({
            date,
            events,
          })),
        }));

        setFilteredIn(intreDateData);


        const filteredInt = exposData.filter((expo) => expo.expoType === 'International');
        setFilteredInt(filteredInt);

        console.log('internaiolnal data', filteredInt);

        const groupedByMonthAndDate = filteredInt.reduce((acc, expo) => {
          const month = moment(expo.fromDate).format("MMMM YYYY"); // Extract month and year
          const date = moment(expo.fromDate).format("Do MMM YYYY"); // Extract specific date

          if (!acc[month]) {
            acc[month] = {}; // Initialize month object
          }

          if (!acc[month][date]) {
            acc[month][date] = []; // Initialize date array within the month
          }

          acc[month][date].push(expo);

          return acc;
        }, {});

        console.log('Date-wise grouped data:', groupedByMonthAndDate);
        const separatedData = Object.entries(groupedByMonthAndDate).map(([month, dates]) => ({
          month,
          dates: Object.entries(dates).map(([date, events]) => ({
            date,
            events,
          })),
        }));
        setseparteDate(separatedData);

      }
    } catch (err) {
      console.error("Error fetching expo data:", err);
      toastError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    completedExpo();
  }, []);


  const handleExploreClick = (expoUnqCode) => {


    window.location.href = '/registration?expoCode=' + expoUnqCode

    // if (selectedCountry && selectedCity && selectedType) {


    //   window.location.reload = '/registration?expoCode=' + expoUnqCode


    // const filtered = expos.filter(
    //   (expo) =>
    //     expo.expoCountry === selectedCountry &&
    //     expo.expoCity === selectedCity &&
    //     expo.expoType === selectedType &&
    //     expo.expoUnqCode === expoUnqCode
    // );
    // setFilteredDates(filtered);
    // setShowSlots(true);
    // } else {
    //   toastWarning('Please select a Country, City, and Expo Type!');
    // }
  };

  useEffect(() => {
    const applyFilterscity = () => {

      let filteredd = expos.filter((expo) => expo.expoType === activeTab);

      if (selectedCountryview) {
        filteredd = filteredd.filter((expo) => expo.expoCountry === selectedCountryview);
      }

      if (selectedCityview) {
        filteredd = filteredd.filter((expo) => expo.expoCity === selectedCityview);
      }

      setFilteredData(filteredd);
    };

    applyFilterscity();
  }, [selectedCountryview, selectedCityview, expos, activeTab]);

  const handleExploreview = () => {
    if (selectedCountryview && selectedCityview) {
      setShowViews(true)
    }
  }

  useEffect(() => {
    const applyFilterInt = () => {

      let filterdd = filteredInt;

      if (selectedCountryInt) {
        filterdd = filterdd.filter((expo) => expo.expoCountry === selectedCountryInt);
      }

      if (selectedCityInt) {
        filterdd = filterdd.filter((expo) => expo.expoCity === selectedCityInt);
      }
      setfilint(filterdd)
    };

    applyFilterInt();
  }, [selectedCountryInt, selectedCityInt, filteredInt]);

  const handleExploreInt = () => {
    if (selectedCountryInt && selectedCityInt) {
      setshowInt(true)
    }
  }

  const switchTab = (tab) => {
    setActiveTab(tab);
  }


  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <section className="page-content">

          {/* banner start  */}

          <div className="cardd dashbrd-main" id='registerTop'>
            <div className="container-fluid px-5">

              <div className="row align-items-center">
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="dashbrd-hme text-center">
                    <h3>DISCOVER YOUR DREAM PROPERTY AT</h3>
                    <h2><span className='nx-clr'>NEX</span> <span>AIRPROPX</span> <br></br>METAVERSE REALESTATE EXPO</h2>
                    <p className=""><b>New York</b></p>

                    <div className="row slet_out MT-0">


                      <div className="col-lg-8 pt-0 d-flex align-items-center justify-content-center col-md-3 col-sm-4">
                        <div className="hBtn go_btn">
                          <h5>Register to Discover Now       </h5>
                          <button onClick={() => handleExploreClick('INHYD14JUL26-R')} className="btn">
                            {/* <span className="kave-line"></span> */}
                            Register                          </button>
                          {/* <button onClick={handleExploreClick}>Explore</button> */}
                        </div>
                      </div>


                    </div>

                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 ">

                  {!showSlots && (

                    <div className="expo-meta">
                      {/* <img src="/assets/images/expo-img.png" alt="expo" /> */}
                      <video autoPlay loop muted >
                        {/* <source src="../../assets/images/terraterri-expo.mp4" type="video/mp4" /> */}
                        <source src="../../assets/images/ttv.mp4" type="video/mp4" />
                        {/* <!-- <source src="./images/terraterri-expo.mp4" type="video/ogg"> --> */}
                      </video>
                    </div>
                  )}
                  {showSlots && (
                    <>
                      <div className="layer disnone"></div>
                      <div>
                        {Array.from(
                          new Set(filteredDates.map((cExpo) => `${cExpo.expoType}|${cExpo.expoCity}`))
                        ).map((key, outerIndex) => {
                          const expo = filteredDates.find(cExpo => `${cExpo.expoType}|${cExpo.expoCity}` === key);
                          const expoType = expo?.expoType || '';
                          const expoCity = expo?.expoCity || '';

                          return (
                            <div key={outerIndex} className='slots_dates'>
                              <div className="">
                                <h2>METAVERSE <span>{expoType}</span> EXPOS</h2>
                                <h3>@ {expoCity}</h3>
                              </div>

                              <div className="slots_dates-inner">
                                {filteredDates
                                  .filter((cExpo) => cExpo.expoType === expoType && cExpo.expoCity === expoCity)
                                  .map((cExpo, innerIndex) => (
                                    <div className="slot_list" key={`${outerIndex}-${innerIndex}`}>
                                      <div className="date_out">
                                        {moment(cExpo.fromDate).format("Do")}-{moment(cExpo.toDate).format("Do MMM YYYY")}
                                      </div>
                                      <div className="book_out">
                                        <Link to={`/home/${cExpo.newExpoId}/${cExpo?.expoUnqCode}`}>
                                          <button>Register</button>
                                        </Link>
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    </>

                  )}
                </div>
              </div>


            </div>
          </div>

          {/* banner end  */}

          <div className="feature_expos mt-4 pb-4">
            <div className="container">
              {/* <div className="row mt-2">
                <div className="col-md-12">
                  <h3>EXPLORE AIRPROPX UPCOMING METAVERSE International Realestate EXPOS</h3>
                </div>
              </div> */}













              <div className="row">
                <div className="col-md-12">
                  <h4 className='typehed'><span>Cities Showcasing</span> AirPropx Metaverse Expos</h4>
                </div>

              </div>

              <Carousel responsive={responsive}
                infinite={true} // Enable infinite looping
                autoPlay={true} // Enable autoplay
                autoPlaySpeed={3000} // Set autoplay speed (in milliseconds)
                pauseOnHover={true} // Pause autoplay on hover
              >


                <div className="col">
                  <div className="cites_expos">
                    {' '}
                    <img src="/assets/images/hyderbad-nw.png" alt="expo" width={290} />
                    <h4>New York</h4>
                  </div>
                </div>
                <div className="col">
                  <div className="cites_expos">
                    {' '}
                    <img src="/assets/images/bengaluru-nw.png" alt="expo" width={290} />
                    <h4>Bengaluru</h4>
                  </div>
                </div>
                <div className="col">
                  <div className="cites_expos">
                    {' '}
                    <img src="/assets/images/mumbai.png" alt="expo" width={290} />
                    <h4>Mumbai</h4>
                  </div>
                </div>
                <div className="col">
                  <div className="cites_expos">
                    {' '}
                    <img src="/assets/images/dheil.png" alt="expo" width={290} />
                    <h4>Delhi</h4>
                  </div>
                </div>

                <div className="col">
                  <div className="cites_expos">
                    {' '}
                    <img src="/assets/images/dubai.png" alt="expo" width={290} />
                    <h4>Dubai</h4>
                  </div>
                </div>
                {/* <div className="col">
                          <div>
                            {' '}
                            <img src="/assets/images/dheil.png" alt="expo" width={290} />
                            <h3>Bengaluru</h3>
                          </div>
                        </div> */}


              </Carousel>

              <div>
              </div>

            </div>
          </div>
        </section>
      )}
    </>
  );
}
export default AirPropex