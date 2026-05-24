import React from 'react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';

const Pricing = () => {
    // ১. কুরিয়ার সার্ভিসের সমস্ত ডেটা (বিভাগ ও জেলা) ব্যাকএন্ড বা রাউটার লোডার থেকে নিয়ে আসা।
    // যদি ডাটাবেজ খালি থাকে, তবে অ্যাপ যেন ক্রাশ না করে, তাই ব্যাকআপ হিসেবে খালি অ্যারে ( || [] ) দেওয়া হয়েছে।
    const serviceCenter = useLoaderData() || [];

    // ২. হিসাব করা ফাইনাল টাকাটি জমা রাখার জন্য একটি স্টেট (State) বা জাদুকরী বাক্স। শুরুতে এটি খালি (null) থাকবে।
    const [calculatedPrice, setCalculatedPrice] = useState(null);

    // ৩. সমস্ত সার্ভিস সেন্টার থেকে শুধু বিভাগের (region) নামগুলো আলাদা করে একটি নতুন লিস্ট তৈরি করা।
    const regionDuplicate = serviceCenter.map(c => c.region);

    // ৪. 'Set' ব্যবহার করে ডুপ্লিকেট বিভাগের নামগুলো ছেঁকে ফেলা হয়েছে, যাতে ড্রপডাউনে একই বিভাগ বারবার না দেখায়।
    const regions = [... new Set(regionDuplicate)];

    // ৫. 'useForm' হলো ফর্ম কন্ট্রোল করার মেইন ইঞ্জিন। 
    // এখানে 'reset' যুক্ত করা হয়েছে যাতে রিসেট বাটনে চাপ দিলে ফর্মের ভেতরের সব লেখা এক ক্লিকে মুছে যায়।
    const { handleSubmit, register, control, reset, formState: { errors } } = useForm(); 
    
    // ৬. 'useWatch' হলো দূরবীনের মতো। ইউজার যখনই পিকআপ বা ডেলিভারি অঞ্চলের ড্রপডাউন পরিবর্তন করবে, 
    // এই দূরবীনটি তা লাইভ ট্র্যাক করে 'senderRegion' এবং 'receiverRegion' ভ্যারিয়েবলে আপডেট করে দেবে।
    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' });

    // ৭. এটি একটি ফিল্টার ফাংশন। ইউজার যে অঞ্চল (Region) সিলেক্ট করবে, এই ফাংশনটি পুরো ডাটাবেজ খুঁজে 
    // শুধুমাত্র সেই অঞ্চলের অধীনে থাকা জেলাগুলোর (District) একটি ইউনিক লিস্ট তৈরি করে ফেরত পাঠাবে।
    const districtsByRegion = region => {
        if (!region) return []; // যদি কোনো অঞ্চল সিলেক্ট করা না থাকে, তবে খালি লিস্ট ফেরত দাও।
        const regionDistricts = serviceCenter.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return [...new Set(districts)]; // জেলার নামও যেন ডুপ্লিকেট না হয়, তাই Set ব্যবহার করা হয়েছে।
    };

    // ৮. যখন ইউজার "Calculate" বাটনে চাপ দেবে, তখন এই মূল ফাংশনটি কাজ শুরু করবে।
    const handlePriceCalculation = (data) => {

        // ৯. পার্সেলটি কি কাগজপত্র বা ডকুমেন্ট? টাইপ যদি 'document' হয় তবে এটি true (হ্যাঁ) হবে, নয়তো false (না)।
        const isDocument = data.parcelType === 'document';
        
        // ১০. মূল লজিক পরিবর্তন: ইউজার যে পিকআপ জেলা এবং ডেলিভারি জেলা সিলেক্ট করেছে, তা হুবহু এক কি না যাচাই করা।
        // এক হলে 'isSameDistrict' হবে true, আলাদা হলে হবে false।
        const isSameDistrict = data.senderDistrict === data.receiverDistrict;

        // ১১. ইনপুট ফিল্ড থেকে ওজনের লেখাটিকে (String) আসল গাণিতিক সংখ্যায় (Number) রূপান্তর করা।
        const parcelWeight = parseFloat(data.parcelWeight || 0);

        // ১২. খরচের হিসাব রাখার জন্য একটি ভ্যারিয়েবল তৈরি করা, যার শুরুর মান ০ টাকা।
        let cost = 0;

        // ১৩. কন্ডিশন ১: পার্সেলটি যদি ডকুমেন্ট (কাগজপত্র) হয়।
        if (isDocument) {
            // একই জেলা হলে ৬০ টাকা, অন্য জেলা হলে ৮০ টাকা।
            cost = isSameDistrict ? 60 : 80;
        } 
        // ১৪. কন্ডিশন ২: পার্সেলটি যদি নন-ডকুমেন্ট (ভারী পার্সেল বা পার্সেল বক্স) হয়।
        else {
            // যদি পার্সেলের ওজন ৩ কেজির কম বা ছোট হয়।
            if (parcelWeight < 3) {
                // একই জেলা হলে ১১০ টাকা, অন্য জেলা হলে ১৫০ টাকা।
                cost = isSameDistrict ? 110 : 150;
            } 
            // যদি পার্সেলের ওজন ৩ কেজি বা তার বেশি হয় (অতিরিক্ত ওজনের হিসাব)।
            else {
                // বেস বা সর্বনিম্ন চার্জ নির্ধারণ (একই জেলায় ১১০, অন্য জেলায় ১৫০ টাকা)।
                const minCharge = isSameDistrict ? 110 : 150;
                // ৩ কেজির চেয়ে ঠিক কতটুকু বেশি ওজন হয়েছে তা বের করা (যেমন: ৫ কেজি হলে অতিরিক্ত ওজন ২ কেজি)।
                const extraWeight = parcelWeight - 3;
                // অতিরিক্ত ওজনের প্রতি কেজির জন্য ৪০ টাকা করে চার্জ। 
                // অন্য জেলা হলে অতিরিক্ত ওজনের ভাড়ার সাথে আরও এক্সট্রা ৪০ টাকা আন্তঃজেলা ফি যোগ হবে।
                const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;

                // মূল সর্বনিম্ন ভাড়ার সাথে অতিরিক্ত ওজনের ভাড়া যোগ করে মোট খরচ বের করা।
                cost = minCharge + extraCharge;
            }
        }

        // ১৫. ফর্মের মেইন অবজেক্টে খরচের মানটি সেট করা।
        data.cost = cost;

        // ১৬. জাদুকরী বাক্সের চাবি (setCalculatedPrice) ঘুরিয়ে নতুন দামটি সেট করা। এটি করার সাথে সাথেই স্ক্রিনে দাম বদলে যাবে।
        setCalculatedPrice(cost);
    };

    // ১৭. রিসেট বাটন ফাংশন। এটিতে ক্লিক করলে ফর্মের সব ইনপুট খালি হবে এবং স্ক্রিনের ভাড়াও ০ বা ফাঁকা হয়ে যাবে।
    const handleReset = () => {
        reset(); // রিঅ্যাক্ট হুক ফর্মের ডাটা রিসেট করে।
        setCalculatedPrice(null); // স্ক্রিনের প্রাইস স্টেট খালি করে।
    };

    return (
        <div className="md:max-w-7xl mx-auto mt-40 mb-10 rounded-xl bg-white shadow-xl h-210">
            <div className="ml-10 mt-23">
                <h1 className="font-bold text-primary text-4xl capitalize py-5">pricing calculator</h1>
                <p className="pb-3">Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. <br /> From personal packages to business shipments — we deliver on time, every time.</p>
            </div>
            <div className="md:max-w-3xl mx-auto py-8">
                <div className="md:max-w-full text-center">
                    <h1 className="font-bold text-primary text-2xl capitalize">calculate your cost</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className='flex-1'>
                        <form onSubmit={handleSubmit(handlePriceCalculation)}>
                            <div className="py-5">
                                <h1 className="font-bold text-[16px] text-primary py-4">Parcel Type</h1>
                                <label className='label mr-4 text-[15px]' >
                                    <input type="radio"
                                        value="document"
                                        className="radio"
                                        defaultChecked
                                        {...register('parcelType', { required: true })} />
                                    Document
                                </label>

                                <label className='label text-[15px]' >
                                    <input type="radio"
                                        value="Non-document"
                                        className="radio"
                                        {...register('parcelType')} />
                                    Non-Document
                                </label>
                                {errors.parcelType?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Must select the parcel type.</p>}
                            </div>
                            <fieldset className="fieldset">
                                {/* --- পিকআপ অঞ্চলের ড্রপডাউন --- */}
                                <legend className="fieldset-legend text-primary text-[16px]">Pickup Region</legend>
                                <select className="select w-full" defaultValue="" {...register('senderRegion', { required: true })}>
                                    <option value="" disabled>Select Pickup Region</option>
                                    {
                                        regions.map((r, index) => (
                                            <option key={index} value={r}>
                                                {r}
                                            </option>
                                        ))
                                    }
                                </select>

                                {/* --- পিকআপ জেলার ড্রপডাউন (পিকআপ অঞ্চলের ওপর নির্ভর করে ফিল্টার হয়) --- */}
                                <legend className="fieldset-legend text-primary text-[16px]">Pickup District</legend>
                                <select className="select w-full" defaultValue="" {...register('senderDistrict', { required: true })}>
                                    <option value="" disabled>Select Pickup District</option>
                                    {
                                        districtsByRegion(senderRegion).map((d, index) => (
                                            <option key={index} value={d}>
                                                {d}
                                            </option>
                                        ))
                                    }
                                </select>

                                {/* --- ডেলিভারি অঞ্চলের ড্রপডাউন --- */}
                                <legend className="fieldset-legend text-primary text-[16px]">Delivery Region</legend>
                                <select className="select w-full" defaultValue="" {...register('receiverRegion', { required: true })}>
                                    <option value="" disabled>Select Delivery Region</option>
                                    {
                                        regions.map((r, index) => (
                                            <option key={index} value={r}>
                                                {r}
                                            </option>
                                        ))
                                    }
                                </select>

                                {/* --- ডেলিভারি জেলার ড্রপডাউন (ডেলিভারি অঞ্চলের ওপর নির্ভর করে ফিল্টার হয়) --- */}
                                <legend className="fieldset-legend text-primary text-[16px]">Delivery Destination (District)</legend>
                                <select className="select w-full" defaultValue="" {...register('receiverDistrict', { required: true })}>
                                    <option value="" disabled>Select Destination District</option>
                                    {
                                        districtsByRegion(receiverRegion).map((d, index) => (
                                            <option key={index} value={d}>
                                                {d}
                                            </option>
                                        ))
                                    }
                                </select>

                                <label className="label font-bold text-primary text-[16px]">Parcel weight (kg)</label>
                                <input type="text" className="input w-full" placeholder="Weight"
                                    {...register('parcelWeight', { required: true })} />
                            </fieldset>
                            <div className="flex items-center gap-5 py-3">
                                <button
                                    type='button'
                                    onClick={handleReset}
                                    className="font-bold capitalize border border-lime-500 text-lime-500 px-4 py-1 rounded-md cursor-pointer"> reset</button>
                                <button
                                    type='submit'
                                    className='font-bold bg-secondary capitalize px-10 cursor-pointer py-1.5 rounded-md'> calculate</button>
                            </div>
                        </form>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <h1 className='font-bold text-7xl text-primary'>{calculatedPrice !== null ? calculatedPrice : 0} Taka</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;