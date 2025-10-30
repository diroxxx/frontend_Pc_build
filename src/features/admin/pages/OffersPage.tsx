import {useFetchOffers} from "../../../hooks/useFetchOffers.ts";
import {useState} from "react";
import {ItemType} from "../../../types/BaseItemDto.ts";

const OffersPage = () => {

    const {data, isLoading, isError} = useFetchOffers();
    const [filters, setFilters] = useState<{ itemType: ItemType | undefined; brand: string }>({ itemType: undefined, brand: "" });


    return (
        <div>
        <div>

        </div>

            <div>
                {
                    data?.map((offer) => (

                    ))
                }
            </div>


        </div>
    )



};
export default OffersPage;