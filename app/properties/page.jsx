import { fetchProperties } from "@/utils/requests";
import PropertyCard from "@/components/PropertyCard";

const PropertiesPage = async () => {
  const properties = await fetchProperties();

  // sort by date
  properties.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4'>
        {properties.length === 0 ? (
          <p>No Properties Found</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3'>
            {properties.data.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesPage;
