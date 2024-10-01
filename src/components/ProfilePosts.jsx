import React from 'react'

const ProfilePosts = ({postData}) => {
  return (
    <div className='w-full flex mt-8 space-x-2'>
        {/* left */}
        <div className='w-[35%] h-[200px] flex justify-center items-center '>
            <img src={postData.photo} alt='no image present' className='h-full w-full object-cover'/ >
        </div>
        {/* Right */}
        <div className='flex flex-col w-[65%]'>
            <h1 className='text-xl font-bold md:mb-2 mb-1 md:text-2xl'>
                {postData.title}
            </h1>
            <div className='flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4'>
                <p>@{postData.username}</p>
                <div className='flex space-x-2'>
                    <p>16-06-24</p>
                    <p>16:45</p>
                </div>
            </div>
            <p className='text-sm font-normal md:text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae sunt blanditiis porro ipsum nobis cum consequatur facere neque voluptas nostrum sed voluptate et repellendus, corrupti voluptatum nemo unde debitis laboriosam iusto exercitationem perferendis ea. Totam.</p>
        </div>
    </div>
  )
}

export default ProfilePosts
