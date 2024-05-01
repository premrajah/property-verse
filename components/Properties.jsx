"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "./Spinner";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`/api/properties?page=${page}&pageSize=${pageSize}`);

        if (res.status === 200) {
          const propertiesData = await res.json();
          const { data } = propertiesData;
          setProperties(data.properties);
          setTotalItems(data.total);
        }
      } catch (error) {
        console.log("fetch properties error ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4'>
        {properties.length === 0 ? (
          <p>No Properties Found</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3'>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties;
